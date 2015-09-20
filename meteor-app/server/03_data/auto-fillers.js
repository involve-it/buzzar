/**
 * Created by ashot on 8/26/15.
 */

Meteor.startup(function(){
  //auto-filler
//
//san jose, ca
//left-top: 37.404026, -121.995056
//right-bottom: 37.295375, -121.797202
//
//----------- random stuff ------------------------------

  var lngMin = -121.995056,
    lngMax = -121.797202,
    latMin = 37.295375,
    latMax = 37.404026,
      siteTypes = bz.cols.siteTypes.find().fetch().map(function(item) { return item._id; });

  var links = [
    'http://www.craigslist.org'
  ];
  var titles = [
    '195/70R14 TIRES ON SALE 195 70 14 TIRES',
    ' 24 speed bike',
    ' 2000 Toyota Camry LE',
    ' 2013 Toyota Corolla *Financing Available! ',
    ' Gun case (Camo leaf), by Levy\'s Leathers (New) ',
    ' Maytag Washing Machine---L**K-- >GREAT DEAL!!!'
  ];
  var descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elit dui, commodo sit amet ornare ac, lacinia at purus. ',
    'Pellentesque tortor orci, dictum at urna a, efficitur tempus libero. Maecenas quis lacus feugiat, varius urna ut, viverra lorem. Nullam vitae nibh ac neque hendrerit commodo. Quisque eu semper nunc',
    'Quisque eu semper nunc.',
    'Vivamus vulputate finibus suscipit. Sed eget tortor nunc. Nulla viverra blandit enim, at lacinia orci tempor vel. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas et sapien sed turpis placerat commodo et vitae nunc. Nunc cursus iaculis ipsum, ac porttitor sapien consequat et. Integer imperdiet accumsan gravida. Nam non dui at tortor gravida pulvinar sed ac leo. Vivamus suscipit est lectus, a mollis neque congue a.',
    'Sed pellentesque nunc nisi, at vestibulum dui porta id.',
    'Fusce laoreet felis ac massa tempus, sed rutrum neque pharetra. Morbi ullamcorper dictum luctus. Fusce ac ante in nibh mollis pulvinar eu consectetur elit. Curabitur mattis facilisis felis ut volutpat. Aliquam mattis, diam sed fringilla hendrerit, lacus nisl aliquam orci, nec molestie lacus nisl a nibh. Proin vel ullamcorper sem, ut pharetra turpis. Aliquam vulputate neque sem, eget lobortis nunc cursus quis. Etiam elit ipsum, porta et lectus id, porta lacinia lectus. Integer vulputate metus sed nulla euismod tincidunt. In nec accumsan justo, ac bibendum quam. Morbi malesuada metus eu nisi auctor dignissim. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    'Cras eu interdum leo. Cras condimentum ut risus ut tincidunt. Fusce convallis euismod turpis non euismod. Duis vehicula neque eu velit facilisis, non fringilla mi commodo.'
  ];

  var locationNames = [
    'Starbucks',
    'Subway',
    'Togos',
    'Apple Store',
    'McDonalds',
    'Subway',
    'KFC',
    'San Francisco International Airport',
    'Pier 39'
  ];

  function random(min, max) {
    return (max - min) * Math.random() + min;
  }

  function getRandomLocation(){
    return {
      coords: {
        lat: random(latMin, latMax),
        lng: random(lngMin, lngMax)
      },
      name: locationNames[parseInt(random(0, locationNames.length - 1))],
      type: 'static'
    };
  }

  function getRandomTitle(){
    return titles[parseInt(random(0, titles.length - 1))];
  }

  function getRandomDescription(){
    return descriptions[parseInt(random(0, descriptions.length - 1))];
  }

  function getRandomLink(){
    return links[parseInt(random(0, links.length - 1))];
  }
//---------------------- end: random stuff -------------------------------

  function fillDatabase(){
    var location, title;
    for(var i = 0; i<100; i++){
      location = getRandomLocation();
      title = getRandomTitle();
      bz.cols.posts.insert({
        userId: 'test',
        type: siteTypes[_.random(0, siteTypes.length - 1)],
        details:{

          hash: title,
          locations: [location],
          title: title,
          description: getRandomDescription(),
          price: random(10, 1000).toFixed(2),
          images: [],
          other: null
        },
        original:{
          url: getRandomLink(),
          coords: location.coords
        },
        status: 'visible'
      });
    }
  }

  function clearDatabase(){
    bz.cols.posts.remove({});
  }

  //clearDatabase();
  //fillDatabase();
  //console.log('Done');
});
