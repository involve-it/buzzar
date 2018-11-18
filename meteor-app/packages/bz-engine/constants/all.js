/**
 * Created by ashot on 8/21/15.
 */

bz.const.randomImageSite = 'https://unsplash.it/600/500/?random';
// bz.const.randomImageSite = 'http://lorempixel.com/600/500/';

// SEARCH:

bz.help.makeNamespace('bz.const.search');
bz.const.search.AROUND_YOU_RADIUS = 5;
bz.const.search.AROUND_YOU_LIMIT = 18;
//bz.const.search.POPULAR_RADIUS = 12;
bz.const.search.POPULAR_LIMIT = 12;
bz.const.search.DEFAULT_PLACE = { // i.e. Happyville
  name: 'Lake Baikal',
  image: 'http://voyage-russie.ru/sites/default/files/tours/baikal3.jpg',
  image2: 'http://d98uffoa56ghc.cloudfront.net/wp-content/uploads/2014/12/30-Stunning-Secret-Places-Most-Tourists-Don%E2%80%99t-Know-About-Lake-Baikal.jpg',
  lat: 53.872151,
  lng: 108.210463
};

bz.const.search.defaultPostCountOnMyItemPage=5;

bz.help.makeNamespace('bz.const.push.type');
bz.const.push.type.chat = 'chat';
bz.const.push.type.comment = 'comment';
bz.const.push.type.post = 'post';
//bz.const.push.type.post = 'default';

bz.help.makeNamespace('bz.const.verification');
bz.const.verification.profileDetailsKeys=["firstName", "lastName", "city","phone","skype", "vk", "twitter", "facebook"];
bz.const.verification.pushPlatforms = ['apn', 'gcm'];

bz.help.makeNamespace('bz.const.likeEntityType');
bz.const.likeEntityType.post = 'post';
bz.const.likeEntityType.comment = 'comment';
bz.const.likeEntityType.all = [bz.const.likeEntityType.post, bz.const.likeEntityType.comment];
