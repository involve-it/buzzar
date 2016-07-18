/**
 * Created by ashot on 8/31/15.
 */
var EARTH_RAD = T9n.getLanguage() === 'en'? 3959 : 6371e3; // radius of Earth, miles/meters
// see this: http://www.movable-type.co.uk/scripts/latlong.html
if(typeof Template !== 'undefined') {
  Template.registerHelper('isDevEnv', function (postIn) {
    return bz.config.env === 'dev';
  });
  
  Template.registerHelper('getDistanceToPost', function (postIn) {
    var ret, post = postIn || this,
      x, y, xcur, ycur, curLoc, dist;
    if (post.details && post.details.locations && post.details.locations[0] && post.details.locations[0].coords) {
      x = post.details.locations[0].obscuredCoords.lat;
      y = post.details.locations[0].obscuredCoords.lng;
      if (curLoc = Session.get('currentLocation')) {
        xcur = curLoc.latitude;
        ycur = curLoc.longitude;


        var R = EARTH_RAD;
        var φ1 = xcur.toRadians(), λ1 = ycur.toRadians();
        var φ2 = x.toRadians(), λ2 = y.toRadians();
        var Δφ = φ2 - φ1;
        var Δλ = λ2 - λ1;

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        ret = Math.round(d);
        //ret = Math.sqrt(Math.pow((xcur - x), 2) + Math.pow((ycur - y), 2));
      }
      /*
       latitude: position.coords.latitude,
       longitude: position.coords.longitude,
       accuracy: position.coords.accuracy*/
      /*navigator.geolocation.getCurrentPosition(function (a) {
       //bz.runtime.maps.currentGeoposition = a;
       bz.runtime.maps.loc = {
       lat: a.coords.latitude,
       lng: a.coords.longitude
       };
       Session.set('loc', bz.runtime.maps.loc);
       });*/
    }
    return ret;
  });

  /* TEST fn hasLivePresences global helper */
  Template.registerHelper('pl', function(posts) {
    var ret = !!bz.help.posts.hasLivePresence.apply(posts);
    return ret;
  });
  

  Template.registerHelper('getPostProgressBar', function() {
    var duration, status, percent, finish, start, now, days, hours, min, barClass, elapsed, titleDays, titleHours, titleMinutes, language, unit;

    status = true;

    /* Current date */
    now = new Date();

    /* Created posts, ms */
    start = new Date(this.timestamp); // Dec 26 2015

    /* N Days of Activism, FINISH */
    finish = new Date(this.endDatePost); // Jan 25 2016

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
  });
    
  Template.registerHelper('getFormattedTs', function (ts) {
    var date = new Date(ts);
    var options = {
      // era: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      //timezone: 'UTC',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return date.toLocaleDateString( Session.get("bz.user.language"), options);
    //return '';
  });
  
  Template.registerHelper('isRussianLanguage', function () {
    return T9n.language === 'ru';
  });
  
  //Template.registerHelper('changeLanguage', function() {});

  Template.registerHelper('bzRenderTemplateI18n', function(templateName){
    var ret = '',
      templateNameRu = templateName + 'Ru';

    if(templateName && Blaze.isTemplate(Template[templateName])){
      if(T9n.language === 'ru' && Template[templateNameRu]){
        ret = Blaze.toHTML(Template[templateNameRu]);
      } else {
        ret = Blaze.toHTML(Template[templateName]);
      }
      //ret = Blaze.toHTMLWithData(Template[templateName], dataObj);
    }
    return Spacebars.SafeString(ret);
  });

  Template.registerHelper('postLimitDescription', function(limit) {
    var postDescription;
        
    postDescription = this.details.description;
    return (postDescription && postDescription.length > limit) ? postDescription.substring(0, limit - 3) + "..." : postDescription;
  });
  
  
}
