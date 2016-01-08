/**
 * Created by douson on 24.08.15.
 */

Template.myItems.onCreated(function () {
  //return Meteor.subscribe('posts-images');
});


Template.onePostRowItemSearch.rendered = function() {
  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};



Template.myItems.onRendered(function () {
  $(document).foundation();
});
 


Template.myItems.helpers({
  hasPosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    return posts.length !== 0;
  },
  allPosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()});
    console.log('all' + posts.count());

    return posts;
  },
  activePosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId(), 'status.visible': 'visible'});
    console.log('active' + posts.count());
    return posts;
  },
  livePosts: function () {
    var posts = bz.cols.posts.find({userId: Meteor.userId()}).fetch();
    var ret = _.filter(posts, function(item){
      var ret = !!item._hasLivePresence();
      return ret;
    });
    console.log('live' + ret.length);
    return ret;
  },
  getCountActivePosts: function() {
    //var postsCount = bz.cols.posts.find({userId: Meteor.userId()}).count();
    //return postsCount || '0';
  },
  getCountLivePosts: function() {
    //var postsCount;
    //return postsCount || '0';
  }
});

Template.onePostRowItemSearch.helpers({
  getPhotoUrl: function () {
    var photo = bz.cols.posts.findOne({_id: this._id}),
      photoId = photo.details.photos && photo.details.photos[0] || undefined;

    if (photoId) {
      var image = bz.cols.images.findOne({_id: photoId});
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

      if (e.target.checked === false) {
        v.data.status.visible = null;
      } else {
        v.data.status.visible = 'visible';
      }
      setTimeout(function(){
        bz.cols.posts.update(v.data._id, {$set: {'status.visible': v.data.status.visible}})
      }, 10);
    }
  },
  'click .js-delete-post': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id,
        content = this.details.description;

    bz.ui.modal(content, function() {
      bz.cols.posts.remove(currentPostId);
    });
  }
});


Template.onePostRowItemOwner.helpers({
  getPhotoUrl: function () {
    var photo = bz.cols.posts.findOne({_id: this._id}),
        photoId = photo && photo.details.photos && photo.details.photos[0] || undefined;

    if (photoId) {
      var image = bz.cols.images.findOne({_id: photoId});
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
    if(this.status.visible === 'visible'){
      ret = 'checked'
    } else {
      ret = '';
    }
    return ret;
  },
  getDuration: function() {
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
    var ms = finish - now;
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
      /*console.log('Обявление закрыто');*/
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
});

Template.chooseCurrency.helpers({
  getCurrency: function(cur) {
    return this.cur ==='usd';
  }
});




















