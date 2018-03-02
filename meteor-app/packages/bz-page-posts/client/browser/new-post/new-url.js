
Template.postsNewUrl.onCreated(function() {
  
  //с прямой ссылок на парсер может не понадобиться
  bz.ui.initVkAPI();
  
});


Template.postsNewUrl.onRendered(function() {

  /*setTimeout(function() {
    //console.log(VK);

    VK.Api.call('wall.getById', {posts:'236268939_743'}, function(r) {
      if(r.response) {
        console.info(r.response[0]);
      }
    });

  }, 1000);*/
  //необходим механиз, который будет следить за загрузкой
 
  
});




Template.postsNewUrl.events({
  'keydown .js-original-url': function(e,v){
    var url = e.target.value;
    if(e.keyCode === 13 &&  url!== '' && isUrl(url)) {
      v.$('.js-post-details-link').click();
      //v.$('.js-scan-url').click();
    } else {
      /*CONSOLE CLEAR
      console.log('keydown');
      */
      if(isUrl(url)) {
        v.$('.js-post-details-link').removeClass('disabled');
      }
    }
  },
  'paste .js-original-url': function(e, v){
    /*Clear data*/
    $('.js-post-title').val('');
    var editor = $('.CodeMirror')[0].CodeMirror;
    editor.setValue('');
    
    var pastedText = getClipBoardDataFromEvent(e);
    if(isUrl(pastedText)) {
      v.$('.js-post-details-link').removeClass('disabled');
    }
  },
  'blur .js-original-url': function(e,v){
    var url = e.target.value;
    if(isUrl(url)) {
      v.$('.js-post-details-link').removeClass('disabled');
    }
  },
  'click .js-post-details-link': function (e, v) {
    var self = v,
        url = self.$('.js-original-url').val();
    
    Meteor.call('parseVk', url, function(er, result) {
      
      if(result.success) {
        
        //Check a property of images
        var attachments = [], attachment = [];
        
        for (var key in result.images) {
          if (!result.images[key].hasOwnProperty('photo')) continue;
          attachments.push(result.images[key]);
        }
        
        //создаем новый массив фото для вставки
        attachments = _.map(attachments, function(value, key, list) {
          return {
            data: value.photo.photo_604,
            name: key
          }
        });
        
        /*
        * FILL DATA
        **/
        
        //Title
        if(result && result.title) {
          var textLowerCase = result.title.toLowerCase(),
              title = textLowerCase.charAt(0).toUpperCase() + textLowerCase.slice(1);
          $('.js-post-title').val(title);
        }
        
        //Description
        if(result && result.text) {

            if ($('.CodeMirror')[0] && $('.CodeMirror')[0].CodeMirror) {
                var editor = $('.CodeMirror')[0].CodeMirror;
                editor.setValue(result.text);
            } else {
              $('.js-post-description').val(result.text);
            }
        }
        
        //Images
        if(result && result.images.length > 0) {
          /*CONSOLE CLEAR
          console.info('Есть фото: ', result.images.length > 0);
        */
        }
        
        
        //new UrlImageClass(attachments);
        //currentImageReactive.set(attachments);
        
        if (self.data.imagesArr) {}
        

        //doneCloseChooseImageDialog(bb, attachments)
        
        /*CONSOLE CLEAR
        console.info('DATA TEMPLATE: ', self.data);
        console.info('result: ', result);
        console.info('img: ', attachments);
        */
        
      } else {
        bz.ui.error('Что-то пошло не так! Пожалуйста, ознакомьтесь с одной из возможных проблем. --ссылка на раздел справки--');
        //console.info(er);
      }
      
    });
    
    
    /*Meteor.call('parseUrl', v.$('.js-original-url').val(), function(err, res) {
      // async scan is done:
      if(res && res.success) {
        if (res.title){
          Session.set('post-title', res.title);
        }
        if (res.content){
          Session.set('post-description', res.content);
        }
        if (res.imageUrl){
          Session.set('bz.posts.postImgSrc', res.imageUrl);
        }
      }
      v.$('.js-post-details-link').removeClass('disabled');
    })*/

  }
});


Template.parsedPostDetailsModal.helpers({
  getTitle: function() {
    return Session.get('post-title');
  }
})
// HELPERS:
function isUrl(str){
  var ret = false;
  if(ret !== '') {
    var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    ret = urlRegEx.test(str);
  }
  return ret;
}
function getClipBoardDataFromEvent(e){
  var pastedText;

  if (window.clipboardData && window.clipboardData.getData) { // IE
    pastedText = window.clipboardData.getData('Text');
  } else if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
    pastedText = e.originalEvent.clipboardData.getData('text/plain');
  } else if (window.event && window.event.clipboardData && window.event.clipboardData.getData) {
    pastedText = window.event.clipboardData.getData('text/plain');
  }
  return pastedText;
}