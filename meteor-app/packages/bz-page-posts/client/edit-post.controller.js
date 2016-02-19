/**
 * Created by arutu_000 on 1/23/2016.
 */
window.a = imagesArrayReactive = new ReactiveVar();

Meteor.startup(()=> {
  imagesArrayReactive.set([]);
});
SavePostFromView = function (v, data) {
  var descriptionFormatted, userId = Meteor.userId(), imgId, diffElemsArr, imgArr = data.details.photos || [], locationsArr = [],
    locDef = $.Deferred(),
    loc1 = Session.get(bz.const.posts.location1),
    loc2 = Session.get(bz.const.posts.location2),

    rad = $('.js-radius-slider').attr('data-slider') && Number.parseInt($('.js-radius-slider').attr('data-slider')),
    otherKeyValuePairs = [], timestamp, endTimestamp;

  // gather all data and submit for post-create:
  if (userId) {
    // 1. remove deleted images (take those ids that are in db array but not in in new array:
    diffElemsArr = _.difference(imgArr, _.map(imagesArrayReactive.get(), function(item) { return item._id}));
    _.each(diffElemsArr, function(imgItem){
      if(imgItem){
        bz.cols.images.remove(imgItem);
        // todo: need to remove it from S3 too!
        imgArr.splice(imgArr.indexOf(imgItem), 1);
      }
    });
    _.each(imagesArrayReactive.get(), function (imgItem) {
      if(!imgItem._id) {
        imgId = bz.cols.images.insert({
          userId: userId,
          name: imgItem.name,
        });
        imgArr.push(imgId);
        // let's set data on the client-side (temp for showing in site):
        bz.cols.images._collection.update(imgId, {
          $set: {
            data: imgItem.data
          }
        });
        if (!imgItem.thumbnail.data) {
          imgItem.thumbnail.getBlob().then((url)=> {
            imgItem.thumbnail.data = url;
            bz.cols.images._collection.update(imgId, {
              $set: {
                thumbnail: imgItem.thumbnail.data
              }
            });
          });
        } else {
          bz.cols.images._collection.update(imgId, {
            $set: {
              thumbnail: imgItem.thumbnail.data
            }
          });
        }
      }
    });
    // set location:
    if (loc1 && location1.isSet) {
      locationsArr.push(loc1);
    }
    if (loc2 && location2.isSet) {
      locationsArr.push(loc2);
    }
    // set the 'other' field, that contains: all other post-specific key-value pairs of info that we want:
    if (v.$('.js-charity-type-select').val()) {
      otherKeyValuePairs.push({
        key: 'whatHappened',
        value: v.$('.js-charity-type-select').val()
      });
    }
    descriptionFormatted = stripOutScriptTags(v.$('.js-post-description').val()) || undefined;
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
        description: descriptionFormatted,
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

    bz.runtime.changesNotSaved = false;
    //Router.go('/posts/my');

    //$.when(locDef).then(function () {
    Meteor.call('saveExistingPost', newPost, currentLoc, Meteor.connection._lastSessionId, function (err, res) {
      _.each(imagesArrayReactive.get(), function (imgItem) {
        if(!imgItem._id) {
          imgItem.save().then(img=> {
            bz.cols.images.update(imgId, {$set: {data: img.src}});
            imgItem.thumbnail.save().then(thumb=> {
              bz.cols.images.update(imgId, {$set: {thumbnail: thumb.src}});
            }).catch(error=>{
              bz.ui.alert(`При сохранении поста возникла проблема: ${error}`);
            });;
          }).catch(error=>{
            bz.ui.alert(`При сохранении поста возникла проблема: ${error}`);
          });;
        }
      });

      if (!err && res) {
        bz.ui.alert(`Ваш <a href="/post/${res}">пост</a> успешно сохранен`);
        //clearPostData();
        //bz.runtime.newPost.postId = res;
      } else if(err) {
        bz.ui.alert(`При сохранении поста возникла проблема: ${err}`);
      }
    });
  }
};

FillPostData = function (data) {
  imagesArrayReactive.set(data._getImagesObjects());
}

stripOutScriptTags = function (text = '') {
  var ret, regex = /<\s*script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/\s*script\s*>/gi;
  ret = text.replace(regex, '');
  return ret;
}