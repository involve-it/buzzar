/**
 * Created by douson on 03.07.15.
 */
var requireLoginController = bz.router.requireLoginController;
// POSTS:

Router.map(function () {
  this.route('posts', {
    path: '/posts',
    controller: 'requireLoginController',
    onBeforeAction: function () {
      Router.go('/posts/my');
    }
  });
  this.route('posts.details', {
    path: '/post/:_id',
    template: 'postsPageDetails',
    waitOn: function() {
      if(this.data()) return;
      
      var dep = new Deps.Dependency;
      var ready = false;



      var handle = {
        ready: function() {
          dep.depend();
          return ready;
        }
      };
      
      var self = this, postId = this.params._id;

      runHitTracking(postId);
      
      Meteor.call('getPost', postId, function(e, r) {
        
        if(r.success && r.result) {
          r.result.hasLivePresence = bz.help.posts.hasLivePresence.apply(r.result);
          r.result.getDistanceToCurrentLocation = bz.help.posts.getDistanceToCurrentLocation.apply(r.result);

          self.result = r.result;
          var data = r.result, photoHelpers = bz.help.images;
          // extend with helpers, since we're not using collection anymore:
          data.details && data.details.photos && data.details.photos.forEach(p => Object.assign(p, photoHelpers));

          Session.set('bz.posts.current', r.result); // very temp solution related to getPost being object, not cursor
        } else {
          bz.ui.alert('Error ID: ' + r.error.errorId, {type:'error', timeout: 2000});
        }

        ready = true;
        dep.changed();
        
      });
      
      return handle;
    },
    result: null,
    data: function () {
      
      /* OLD CODE */
      /*var ret;
      ret = bz.cols.posts.findOne({_id: this.params._id});
      if (ret) {
        Meteor.subscribe('bz.users.all')
      }
      return ret;*/

      return this.result;
    },
    //controller: 'requireLoginController',
    onAfterAction: function () {
      //var post = this.data();
      //post && runHitTracking(post);
      /*CONSOLE CLEAR
      console.log('onAfterAction', this.data());
      */
    },
    onBeforeAction: function () {
      /*if (!this.data()) {
        Router.go('/page-not-found');
      }*/
      
      this.next();
    }
  });
  this.route('posts.edit', {
    path: '/posts/:_id/edit',
    template: 'pagePostsEdit',
    waitOn: function(){
      if (Meteor.userId()) {
        return [Meteor.subscribe('bz.images.user', Meteor.userId())]
      }
    },
    data: function () {
      var ret;
      ret = bz.cols.posts.findOne({_id: this.params._id});
      if (ret) {
        Meteor.subscribe('users', ret.userId);
        if (ret.userId == Meteor.userId()) {
          return ret;
        } else {
          Router.go('/page-not-found');
        }
      }
    },
    //controller: 'requireLoginController',
    onBeforeAction: function () {
      if (!this.data()) {
        Router.go('/page-not-found');
      } else {
      }
      this.next();
    },
    onStop: Router.UnsavedPageRouteStopHandler
  });

  this.route('postsMy', {
    path: '/posts/my',
    layoutTemplate: 'mainLayout',
    controller: 'requireLoginController',
    waitOn: function () {
      if (Meteor.userId()){
        return [
          Meteor.subscribe('bz.images.user', Meteor.userId()),
        ]
      }
    }
  });
  //create post for iframe(mvc project)
  this.route('postsNewIframe',{
    path:'/posts/new_forIframe/:userid',
    template: 'postsNew',
    waitOn: function () {
      var userId = this.params.userid;
      Session.set('IFrameUserId', userId);
      if(userId) {
        return [
          Meteor.subscribe('bz.images.user', userId),
          bz.help.maps.googleMapsLoad()
        ]
      }
    },
    onBeforeAction: function () {
      var userId = this.params.userid;
      $("#bz-header").css("display","none");
      $("#bz-footer").css("display","none");
      newPostType.set('ad');
      this.next();
    },
    onStop: Router.UnsavedPageRouteStopHandler
  });

  // create post flow:
  this.route('postsNew', {
    path: '/posts/new',
    controller: 'requireLoginController',
    waitOn: function () {
      if(Meteor.userId()) {
        return [
          Meteor.subscribe('bz.images.user', Meteor.userId()),
          bz.help.maps.googleMapsLoad()
        ]
      }
    },
    onBeforeAction: function () {
      // temporarily redirect to create post, remove when create link is ready:
      var iFrameStatus;
      try {
        iFrameStatus=bz.help.getParamURL();
        iFrameStatus=(iFrameStatus&&iFrameStatus.isiframe);
      }catch(err){
        console.info('ошибка в обработке url: '+err.message);
      }
      if(iFrameStatus!=='true') {
        Router.go(`/posts/new?type=ad`);
      }
      if (this.params.query.type && this.params.query.type !== 'undefined') {
        newPostType.set(this.params.query.type);
      } else {
        newPostType.set(undefined);
      }
      this.next();
    },
    onStop: Router.UnsavedPageRouteStopHandler

    /*data: function () {
     return Meteor.users.findOne({_id: this.params._id});
     }*/
  });
  this.route('postsNewShare', {
    path: '/posts/new/share',
    template: 'newPostPageShare',
    controller: 'requireLoginController',
    waitOn: function () {
      if(Meteor.userId()) {
        return [Meteor.subscribe('bz.images.user', Meteor.userId())];
      }
    }
  });
});