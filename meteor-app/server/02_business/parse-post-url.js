/**
 * Created by ashot on 8/18/15.
 */

function getImageUrl(body){
  // order images by sum of width and height, and get the largest one
  var imgs = _.sortBy(body.find('img'), function(img){
    return parseInt((img.attribs.width || 0)) + parseInt((img.attribs.height || 0));
  });
  if (imgs.length > 0){
    return _.last(imgs).attribs.src;
  }

  return null;
}

function getContent(body){
  //possible parent text elements
  var textElements = body.find('div,section');
  var tagClone;
  //helper to get text count for comparison (without any children that potentially may have their own text containers)
  //spaces and line breaks are replaced with empty character for count only
  var calculateTextLength = function(tag){
    tagClone = tag.clone();
    //:visible and :hidden tags are not supported by cheerio. TBD
    //tagClone.find('not(:visible)').remove();
    tagClone.children('div,section,nav,script,aside,figure,a,article,meta,textarea,header,iframe,object,table').remove();

    return tagClone.text().replace(/ /g, '').replace(/\n/g, '').length;
  };
  var el, textLength, $el;
  var count = 0;
  //go thru all containers and find one with longest text
  _.each(textElements, function(e, i){
    $el = textElements.eq(i);
    textLength = calculateTextLength($el);
    if (textLength > count){
      count = textLength;
      el = $el;
    }
  });
  if (el){
    //el.find('not(:visible)').remove();
    tagClone = el.clone();
    // this is attempt to see if there are unnecessary text containers inside the one we picked - i.e. navigation, banners, ads, meta, scripts, etc.
    // no 'a' tag removal
    tagClone.children('div,section,nav,script,aside,figure,article,meta,textarea,header,iframe,object,table').remove();
    var text = tagClone.text();
    // if what's left is greater than 70% of original - use that, otherwise - use original
    if (text.length / el.text().length > 0.7){
      return text.trim();
    } else {
      return el.text().trim();
    }
  }

  return null;
}

//returns url up to first '?' (if exists)
function getBaseUrl(url){
  if (url){
    var index = url.indexOf('?');
    if (index !== -1){
      return url.slice(0, index);
    }
  }
  return url;
}
//returns protocol and domain name
function getDomainUrl(url){
  if (url){
    var constructed = '';
    var index = url.indexOf('//');
    if (index !== -1){
      constructed+= url.slice(0, index + 2);
      url = url.slice(index + 2);
    }
    index = url.indexOf('/');
    if (index !== -1){
      url = url.slice(0, index);
    }
    constructed += url;
    return constructed;
  }
  return url;
}
//returns protocol + ':'
function getProtocol(url){
  if (url) {
    var index = url.indexOf('//');
    if (index !== -1) {
      return url.slice(0, index);
    }
  }
  return null;
}

bz.bus.parseHtml = function(html, url){
  var $ = cheerio.load(html);
  var body = $('body');

  //get image
  var imageUrl = getImageUrl(body);

  //construct image url
  if (url && url.length > 0 && imageUrl && (imageUrl.length <4 || imageUrl.slice(0,4).toUpperCase() !== 'HTTP')){
    //if url starts with '//', just append protocol
    if (imageUrl.length >= 2 && imageUrl[0] === '/' && imageUrl[1] === '/'){
      imageUrl = getProtocol(url) + imageUrl;
    } else {
      var baseUrl;
      // if image has '/' as a first symbol - url refers to root, base url will be domain name
      if (imageUrl[0] === '/') {
        baseUrl = getDomainUrl(url);
      }//otherwise, it's relative - base url is full url up until query string
      else {
        baseUrl = getBaseUrl(url);
      }
      //concatenate those two
      if (baseUrl) {
        //making sure that url is in proper format
        if (baseUrl[baseUrl.length] === '/' && imageUrl[0] !== '/' || baseUrl[baseUrl.length] !== '/' && imageUrl[0] === '/') {
          imageUrl = baseUrl + imageUrl;
        } else {
          imageUrl = baseUrl + '/' + imageUrl;
        }
      }
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
    throw e;
  }
  return result;
};