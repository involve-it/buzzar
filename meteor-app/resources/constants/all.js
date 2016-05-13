/**
 * Created by ashot on 8/21/15.
 */
bz.help.makeNamespace('bz.const.places');
//bz.const.places.CURRENT_LOCATION = 'My Location';
//bz.const.places.CURRENT_LOCATION_DB = 'CURRENT';
bz.help.makeNamespace('bz.const.user.status');
bz.const.user.status.ONLINE = 'online'; //- мы "видим"/пеленгуем юзера
bz.const.user.status.OFFLINE = 'offline'; // - нет

bz.help.makeNamespace('bz.const.posts.status.visibility');
bz.const.posts.status.visibility.VISIBLE = 'visible';
bz.const.posts.status.visibility.INVISIBLE = null;

// bz.const.posts.status.visibility.ARCHIVED = 2; // tbd
bz.help.makeNamespace('bz.const.posts.status.presence');
bz.const.posts.status.presence.NEAR = 'close';
bz.const.posts.status.presence.AWAY = 'away';
bz.help.makeNamespace('bz.const.posts.type');
bz.const.posts.type.ad = 'ad';
bz.const.posts.type.memo = 'memo';


bz.help.makeNamespace('bz.const.locations.type');
bz.const.locations.type.STATIC = 'static';
bz.const.locations.type.DYNAMIC = 'dynamic';
bz.const.locations.type.GOOGLEPLACE = 'google';
bz.const.locations.type.MYPLACE = 'my place';
bz.const.locations.defaultDistance = 2;
bz.const.locations.earthRadius = 3961;
bz.const.locations.MAXRADIUS = 10000;

bz.help.makeNamespace('bz.const.posts.session.names');
bz.const.posts.locationGlobal = 'bz.runtime.newPost.location';
bz.const.posts.location1 = 'bz.posts.new.location1';
bz.const.posts.location2 = 'bz.posts.new.location2';

bz.const.randomImageSite = 'http://lorempixel.com/600/500/';

// SEARCH:

bz.help.makeNamespace('bz.const.search');
bz.const.search.AROUND_YOU_RADIUS = 5;
bz.const.search.AROUND_YOU_LIMIT = 18;
//bz.const.search.POPULAR_RADIUS = 12;
bz.const.search.POPULAR_LIMIT = 12;

bz.const.search.defaultPostCountOnMyItemPage=5;

bz.help.makeNamespace('bz.const.push.type');
bz.const.push.type.chat = 'chat';
bz.const.push.type.comment = 'comment';
bz.const.push.type.post = 'post';
bz.const.push.type.post = 'default';

bz.help.makeNamespace('bz.const.verification');
bz.const.verification.profileDetailsKeys=["firstName", "lastName", "city","phone","skype", "vk", "twitter", "facebook"];