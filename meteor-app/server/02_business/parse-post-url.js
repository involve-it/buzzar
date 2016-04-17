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

function getContent(body, typeSite){
  var ret;
  if(typeSite === 'vk.com') {
    ret = VkPostParser(body);
  } else {
    ret = CatchAllPostParser(body);
  }


  return ret;
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
  var $, body, siteType, imageUrl, content, title;
  $ = cheerio.load(html);
  body = $('body');
  siteType = siteTypeDetector(url);
  //get image
  imageUrl = getImageUrl(body);
  content = getContent(body, siteType);
  title = $('title').text();

  //construct image url
  imageUrl = constructImageUrl(imageUrl, url);

  return {
    title: title,
    imageUrl: imageUrl,
    content: content
  };
};

bz.bus.parseUrl = function(url){
  var resultme;
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


function siteTypeDetector (url) {
  var ret = 'other';
  if(url.indexOf('vk.com') > -1 || url.indexOf('vkontakte.ru') > -1) {
    ret = 'vk.com';
  }
  return ret;
}
function constructImageUrl(imageUrl, url){
  var retImageUrl = imageUrl;
  if (url && url.length > 0 && imageUrl && (imageUrl.length <4 || imageUrl.slice(0,4).toUpperCase() !== 'HTTP')){
    //if url starts with '//', just append protocol
    if (imageUrl.length >= 2 && imageUrl[0] === '/' && imageUrl[1] === '/'){
      retImageUrl = getProtocol(url) + imageUrl;
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
          retImageUrl = baseUrl + imageUrl;
        } else {
          retImageUrl = baseUrl + '/' + imageUrl;
        }
      }
    }
    return retImageUrl;
  }
}