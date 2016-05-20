/**
 * Created by douson on 24.08.15.
 */
Template.onePostRowItemOwner.onRendered(function () {});

Template.myItems.onCreated(function () {
  //return Meteor.subscribe('posts-images');
  this.getMyPostsData = new ReactiveVar(false);
});

Template.onePostRowItemSearch.rendered = function() {
  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};

Template.myItems.onCreated( function() {
  this.currentTab = new ReactiveVar( "active" );
  this.getMyPostsData = new ReactiveVar(false);
});

Template.myItems.onRendered(function () {
  $(document).foundation();
});

Template.myItems.helpers({
  hasPosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    return posts.length !== 0;
  }
  /*OLD CODE*/
  /*,
  allPosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()});
    return posts;
  },
  activePosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId(), 'status.visible': bz.const.posts.status.visibility.VISIBLE});
    //console.info(posts.fetch());
    return posts;
  },
  livePosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    var ret = _.filter(posts, function(item){
      var ret = !!item._hasLivePresence();
      return ret;
    });
    console.info(ret);
    return ret;
  }*/
});

Template.myItems.helpers({
  tab: function() {
    return Template.instance().currentTab.get();
  },
  getMyPosts: function(type) {
    var tab = Template.instance().currentTab.get(), ins = Template.instance();

    if (ins.getMyPostsData.get() === false) {
      Meteor.call('getMyPosts', {type:tab}, function(e, r) {
        if(e) {
          //error
        } else if(r.success && r.result) {
          ins.getMyPostsData.set(r.result);
          
          _.each(r.result, function(post){
            post.hasLivePresence = bz.help.posts.hasLivePresence.apply(post);
          });
          
        } else {
          bz.ui.alert('Error ID: ' + r.error.errorId, {type:'error', timeout: 2000});
        }
      });
    }
    //console.info(ins.getMyPostsData.get());
    return {postType: tab, items: ins.getMyPostsData.get()};
  }
});

Template.myItems.events({
  'click .nav-pills li': function( e, v ) {
    var currentTab = $( e.target ).closest( "li" ),
        type = v.currentTab;
    
    if(type.get() !== currentTab.data("template")) {
      v.getMyPostsData.set(false);
      /*$( ".list-group" ).fadeOut( 'slow' );*/
      currentTab.addClass( "active" );
      $( ".nav-pills li" ).not( currentTab ).removeClass( "active" );
      type.set( currentTab.data( "template" ) );
    }
  }
});







Template.onePostRowItemSearch.helpers({
  getPhotoUrl: function () {
    var photo = bz.cols.posts.findOne({_id: this._id}),
      photoId = photo && photo.details.photos && photo.details.photos[0] || undefined;

    if (photoId) {
      var image = bz.cols.images.findOne({_id: photoId});
    }
    // try to get thumb:
    if(image) {
      if(image.thumbnail && typeof image.thumbnail === 'string'){
        image = image.thumbnail;
      } else if(image.thumbnail && image.thumbnail.src) {
        image = image.thumbnail.src
      } else if(image.data){
        image = image.data
      } else {
        image = '/img/content/no-photo.png';
      }
    }
    return image;
  },
  getPrice: function () {},
  categoryType: function() {
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  },
  getAvatarImg: function () {
    var ret ='';
    if(this.userId && Meteor.users.findOne(this.userId) && Meteor.users.findOne(this.userId).profile.image) {
      return ret = Meteor.users.findOne(this.userId).profile.image.data;
      
    } else {
      return '/img/content/avatars/avatar-no.png';
    }
  },
  getUserName: function() {
    var ret = '';
    if(this.userId && Meteor.users.findOne(this.userId)) {
      ret = Meteor.users.findOne(this.userId).username.toCapitalCase();
    }
    return ret;
  }
});
/*
* Template for owner posts
*/
Template.onePostRowItemOwner.events({
  'click .js-switch-wrapper': function(e, v){
  },
  'click .js-switch-activity-input': function(e,v){
    if(v.data) {
      v.data.status = v.data.status || {};
      var now, start, finish, target, duration, tsPause,status, obj;
      now = new Date().getTime();

      start = new Date(v.data.timestamp).getTime();
      finish = new Date(v.data.endDatePost).getTime();
      if (e.target.checked === false) {
        status = bz.const.posts.status.visibility.INVISIBLE;
        tsPause=finish-now;
        obj={'timePause':tsPause,
          'status.visible': status};
      } else {
        status = bz.const.posts.status.visibility.VISIBLE;
        if(v.data.timePause <= 0){

          duration = finish - start;
          target = now + duration;
          if(v.data) {
            obj={
              'timestamp': now,
              'endDatePost': target,
              'timePause':duration,
              'status.visible': status
            };
          }
        }else{
          var newTimeStamp;
          tsPause=new Date(v.data.timePause).getTime();
          duration= finish - start;
          target = now + tsPause;
          newTimeStamp=target-duration;
          if(v.data) {
            obj = {
              'timestamp': newTimeStamp,
              'endDatePost': target,
              'timePause':tsPause,
              'status.visible':status
            };
          }
        }
      }
      if (obj) {
        _.defer(function () {
         /* bz.cols.posts.update({_id: v.data._id}, {
            $set: obj
          });*/
          Meteor.call('timePostUpdate',v.data._id,obj);
        });
      }
    }
  },
  'click .js-delete-post': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id,
        content = this.details.description;
    bz.ui.modal(content, function() {
      Meteor.call('removePost', currentPostId, Meteor.userId());
    });
  },
  'click .js-reset-post': function(e, v) {
    var now, start, finish, target, duration,obj, content;
    
    now = new Date().getTime();
    start = new Date(v.data.timestamp).getTime();
    finish = new Date(v.data.endDatePost).getTime();

    duration = finish - start;
    target = now + duration;
    /* now    =>  timestamp   */
    /* target =>  endDatePost */
    
      if(v.data) {
        obj = {
          'timestamp': now,
          'endDatePost': target,
          'status.visible': bz.const.posts.status.visibility.VISIBLE
        };
        
        content = {
          postTitle: '<strong>' + this.details.title + '</strong>',
          subjectStart: T9n.get('RELOAD_POST_CONTENT_SUBJECT_START'),
          subjectEnd: T9n.get('RELOAD_POST_CONTENT_SUBJECT_END')  
        };
        
        /*
        * param @content - must be object
        */
        
        bz.ui.modal.confirm(content, function() {
          Meteor.call('timePostUpdate', v.data._id, obj);
        });
      }
  }
});


Template.onePostRowItemOwner.helpers({
  isActive: function() {
     return (this.status.visible) ? 1 : 0;
  },
  getPhotoUrl: function () {
    var photo = bz.cols.posts.findOne({_id: this._id}),
        photoId = photo && photo.details.photos && photo.details.photos[0] || undefined;

    if (photoId) {
      var image = bz.cols.images.findOne({_id: photoId});
    }
    // try to get thumb:
    if(image) {
      if(image.thumbnail && typeof image.thumbnail === 'string'){
        image = image.thumbnail;
      } else if(image.thumbnail && image.thumbnail.src) {
        image = image.thumbnail.src
      } else if(image.data){
        image = image.data
      } else {
        image = '/img/content/no-photo.png';
      }
    }
    return image;
  },
  getPrice: function () {},
  categoryType: function() {
    if( !bz.cols.posts.findOne({_id: this._id}) ) return;
    return bz.cols.posts.find({_id: this._id}).fetch()[0].type;
  },
  getDescription: function() {
    var self = this,
        textDescription = self.details.description,
        limit = 200;
        /*limit = variable.hash.limitCharacter;*/
    
    if(textDescription) {
      var tx = textDescription.slice(0, limit);
      tx += '...';
    }

    return tx;
  },
  getAvatarImg: function () {
    var ret ='';

    if(this.userId && Meteor.users.findOne(this.userId) && Meteor.users.findOne(this.userId).profile.image) {
      return ret = Meteor.users.findOne(this.userId).profile.image;
    } else {
      return '/img/content/avatars/avatar-no.png';
    }
  },
  getUserName: function() {
    var ret = '';
    if(this.userId && Meteor.users.findOne(this.userId)) {
      ret = Meteor.users.findOne(this.userId).username.toCapitalCase();
    }
    return ret;
  },
  getVisibilityVal: function(e,v,c){
    var ret;
    if(this.status.visible === bz.const.posts.status.visibility.VISIBLE){
      ret = 'checked'
    } else {
      ret = '';
    }
    return ret;
  },
  getPostOff: function() {
    /* turn off the post, addClass - bz-post-off */
    var ret;
    if(this.status.visible === null) return ret = true;    
    return ret;
  },
  getDuration: function() {
    if(true) {
      var duration, status, percent, finish, start, now, days, hours, min, barClass, elapsed, titleDays, titleHours, titleMinutes, language, unit;

      status = true;

      /* Current date */
      now = new Date();

      /* Created posts, ms */
      if( !bz.cols.posts.findOne({_id: this._id}) ) return;
      start = new Date(bz.cols.posts.findOne({_id: this._id}).timestamp); // Dec 26 2015

      /* N Days of Activism, FINISH */
      finish = new Date(bz.cols.posts.findOne({_id: this._id}).endDatePost); // Jan 25 2016

      /* ALL ms or 100% */
      duration = finish - start;

      /* left time */
      if (bz.cols.posts.findOne({_id: this._id}).status.visible){
        var ms = finish - now;
      } else{
        var ms =bz.cols.posts.findOne({_id: this._id}).timePause;
      }
      days = Math.floor(ms / 86400000);
      hours = Math.floor((ms - (days * 86400000)) / 3600000);
      min = Math.floor((ms - (days * 86400000) - (hours * 3600000)) / 60000);

      // Объявлению осталось: + "Дней: " + days + " часов: " + hours + " минут: " + min;


      elapsed = new Date().getTime() - start;
      /*var elapsedDays = Math.floor(elapsed / 86400000);*/

      percent = ms / duration * 100;

      /* bz-bar-yellow < 50; bz-bar-red < 20; bz-bar-green > 50 ] */
      if( percent < 20 ) {
        barClass = 'red';
      } else if( percent < 50 ) {
        barClass = 'yellow';
      } else if( percent >= 50 ) {
        barClass = 'green';
      }
      if( percent <= 0 ) {
        percent = 0;
        status = false;

        /* update the status on visible, null  */
        var obj ={ status: {visible: null}, timePause: 0};
        Meteor.call('timePostUpdate',this._id,obj);
      }
      language = Session.get('bz.user.language');
      function endingOfTheWord(lang, number, title, titleEng) {
        if( lang === 'en' ) {

          var eng = [0, 1];
          return titleEng[ (number > 1) ? 1 : 0 ];

        } else if( lang === 'ru' ) {
          var rus = [2, 0, 1, 1, 1, 2];
          return title[ (number%100>4 && number%100<20) ? 2 : rus[ (number%10<5) ? number%10 : 5 ] ];
        }
      }
      if(days > 1) {
        titleDays = endingOfTheWord(language, days, ['день', 'дня', 'дней'], ['day', 'days']);
        unit = days + ' ' + titleDays;
      } else if(days == 1) {
        titleDays = endingOfTheWord(language, days, ['день', 'дня', 'дней'], ['day', 'days']);
        titleHours = endingOfTheWord(language, hours, ['час', 'часа', 'часов'], ['hour', 'hours']);
        titleMinutes = endingOfTheWord(language, min, ['минута', 'минуты', 'минут'], ['minute', 'minutes']);
        unit = (hours == 0) ? days + ' ' + titleDays + '   ' + min + ' ' + titleMinutes : days + ' ' + titleDays + '   ' + hours + ' ' + titleHours;
      } else if(days == 0) {
        titleHours = endingOfTheWord(language, hours, ['час', 'часа', 'часов'], ['hour', 'hours']);
        titleMinutes = endingOfTheWord(language, min, ['минута', 'минуты', 'минут'], ['minute', 'minutes']);
        unit = (days == 0 && hours == 0) ? min + ' ' + titleMinutes : hours + ' ' + titleHours + '   ' + min + ' ' + titleMinutes;
      }
      return  {
        percent: percent,
        leftDays: days,
        unit: unit,
        barClass: barClass,
        status: status
      };
    }
    
  }
});
Template.chooseCurrency.helpers({
  getCurrency: function(cur) {
    return this.cur ==='usd';
  }
});