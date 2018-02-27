/**
 * Created by douson on 4/14/16.
 */
import { HTTP } from 'meteor/http';

// Парсим URL который приходит с формы
bz.bus.getTypeUrl = function(url) {
  var data = {href: '', protocol: '', host: '', hostname: '', port: '', pathname: '', search: '', hash: ''},
      ret = {};
  
  
  var pattern = "^(([^:/\\?#]+):)?(//(([^:/\\?#]*)(?::([^/\\?#]*))?))?([^\\?#]*)(\\?([^#]*))?(#(.*))?$";
  var rx = new RegExp(pattern);
  var parts = rx.exec(url);

  data.href = parts[0] || "";
  data.protocol = parts[1] || "";
  data.host = parts[4] || "";
  data.hostname = parts[5] || "";
  data.port = parts[6] || "";
  data.pathname = parts[7] || "/";
  data.search = parts[8] || "";
  data.hash = parts[10] || "";
  
  ret = {
    host: data.host || '',
    url: data.href || ''
  };
  //возвращает объект с распарсенным url
  return getBzTypeSite(ret);
};

// В зависимости от типа сайта выполняем нужный парсер
function getBzTypeSite(ret) {
  var host = ret.host,
      url = ret.url;
  
  
  var typeParser = {
    'vk.com':       bz.bus.parseUrlVk(url),
    'new.vk.com':   bz.bus.parseUrlVk(url),
    'default':      'error'
  };
  
  return typeParser[host] || typeParser['default'];
}

// Парсер для ВКонтакте
bz.bus.parseUrlVk = function(url) {
  
  var result = {}, data = {}, response, pattern, rx, parts, text, searchEl, indexFr;
  
  //pattern = "(([=wall-])\\d{0,}_\\d{0,})";
  pattern = "([^=wall]\\d{0,}_\\d{0,})";
  
  rx = new RegExp(pattern);
  parts = rx.exec(url);
  
  data = {
    verAPI:   '5.50',
    method:   'wall.getById',
    typeItem: 'posts',
    postId:   parts[0]
  };
  
  try {
    
    //response = Meteor.http.call("GET", 'https://api.vk.com/method/'+data.method+'?'+data.typeItem+'=-43726747_87397&v='+data.verAPI);
    response = HTTP.call("GET", 'https://api.vk.com/method/'+data.method+'?'+data.typeItem+'='+ data.postId +'&v='+data.verAPI);
    
    if (response && response.statusCode === 200) {

      //var obj = JSON.parse(response.content).response[0];
      //var obj = JSON.parse(JSON.stringify(response.content).replace(/\\n/g, "<br>"));
      //var obj = JSON.stringify(response.content).replace(/\\n/g, "<br>");
      //result.text = obj.text;
      
      var string = JSON.parse(response.content).response[0];

      //debugger;

      if(typeof string === 'object') {

        if (string.text === '') {
          if(string.attachments && string.attachments.length > 0) {
            //console.info('Photo attachments[array]', string.attachments);
            result.images = string.attachments;
          }
        } else {
          
          if(string.text !== '') {
            text = string.text;
          } else if(string.copy_history[0]) {
            string = string.copy_history[0];
            text = string.text;
          }
          
          if(text) {
            var obj = JSON.stringify(text).replace(/\\n/g, "<br>");
            searchEl = '<br><br>';
            indexFr = obj.indexOf(searchEl);

            // Title and description text
            if (indexFr !== -1){
              result.title = String(obj.slice(1, indexFr));
              result.text = String(obj.slice(indexFr + searchEl.length));
            } else {
              result.title = String(obj);
              result.text = String(obj);
            }
          }
          // Images[]
          if(string.attachments) {
            if(string.attachments.length > 0) {
              //console.info('Photo attachments[array]', string.attachments);
              result.images = string.attachments;
            } else if(string.attachment.length > 0) {
              //console.info('Photo attachment[photo]', string.attachment);
              //result.images = string.attachment;
            }
          }
        }
        
        result.success = true;
        
      }
    } else {
      result.success = false;
    }
  } catch(e) {
    result.success = false;
  }

  return result;
};