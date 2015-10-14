/**
 * Created by ashot on 8/21/15.
 */
bz.help.makeNamespace('bz.const.places');
bz.const.places.CURRENT_LOCATION = 'My Location';
//bz.const.places.CURRENT_LOCATION_DB = 'CURRENT';
bz.help.makeNamespace('bz.const.user.status');
bz.const.user.status.ONLINE = 'online'; //- мы "видим"/пеленгуем юзера
bz.const.user.status.OFFLINE = 'offline'; // - нет

bz.help.makeNamespace('bz.const.posts.status.visibility');
bz.const.posts.status.visibility.VISIBLE = 'visible';
bz.const.posts.status.visibility.INVISIBLE = 'invisible';

// bz.const.posts.status.visibility.ARCHIVED = 2; // tbd
bz.help.makeNamespace('bz.const.posts.status.presence');
bz.const.posts.status.presence.NEAR = 'close';
bz.const.posts.status.presence.AWAY = 'away';

bz.help.makeNamespace('bz.const.locations.type');
bz.const.locations.type.STATIC = 'bz.static';
bz.const.locations.type.DYNAMIC = 'bz.dynamic';
bz.const.locations.type.GOOGLEPLACE = 'google';
bz.const.locations.type.MYPLACE = 'my place';

bz.help.makeNamespace('bz.const.posts.session.names');
bz.const.posts.locationGlobal = 'bz.runtime.newPost.location';
bz.const.posts.location1 = 'bz.posts.new.location1';
bz.const.posts.location2 = 'bz.posts.new.location2';

bz.const.randomImageSite = 'http://lorempixel.com/400/300/';
