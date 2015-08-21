/**
 * Created by ashot on 8/18/15.
 */

function getImageUrl(body){
  var imgs = _.sortBy(body.find('img'), function(img){
    return img.width + img.height;
  });
  if (imgs.length > 0){
    return _.last(imgs).attribs.src;
  }

  return null;
}

function getContent(body){
  var textElements = body.find('div,section');
  var tagClone;
  var textOnly = function(tag){
    tagClone =tag.clone();
    tagClone.children('div,section,nav,script,aside,figure,a').remove();
    return tagClone.text().replace(/ /g, '').replace(/\n/g, '');
  };
  var el, text, $el;
  var count = 0;
  _.each(textElements, function(e, i){
    $el = textElements.eq(i);
    text = textOnly($el);
    if (text.length > count){
      count = text.length;
      el = $el;
    }
  });
  if (el){
    return el.text();
  }

  return null;
}

bz.bus.parseHtml = function(html, url){
  var $ = cheerio.load(html);
  var body = $('body');

  var imageUrl = getImageUrl(body);
  if (url && url.length > 0 && (imageUrl.length <4 || imageUrl.slice(0,4) !== 'http')){
    if (url[url.length] === '/'){
      imageUrl = url + imageUrl;
    } else {
      imageUrl = url + '/' + imageUrl;
    }
  }

  return {
    title: $('title').text(),
    imageUrl: imageUrl,
    content: getContent(body)
  };
};

bz.bus.parseUrl = function(url){
  var result;
  try {
    var response = Meteor.http.call("GET", url);
    if (response && response.statusCode === 200){
      result = bz.bus.parseHtml(response.content, url);
      result.success = true;
    } else {
      result = {
        success: false
      };
    }
  } catch(e){
    result = {
      success: false
    };
  }
  return result;
};