
IfIframeHideElements = function () {
    var iFrameStatus;
    try {
        iFrameStatus=bz.help.getParamURL();
        console.log('iframe:IfIframeHideElements', iFrameStatus&&iFrameStatus.isiframe);

        if(iFrameStatus&&iFrameStatus.isiframe){
            $('#bz-header').css('display', 'none');
            $('#bz-footer').css('display', 'none');
            setIframeSessionObj();
            SetIframeEventListeners();
            redirectLinksToShinersRu();
        }

    }catch(err){
        console.info('ошибка в обработке url: '+err.message);
    }
};
Meteor.startup(() => {
    Tracker.autorun(() => {
        if (Session.get('iframeObject')) {
            $('#bz-header').hide();
            $('#bz-footer').hide();
        }
    });
    Tracker.autorun(() => {
        if (Session.get('iframePage')) {
            console.log('iframe:receiveMessage', event.data.pagePath)
            IfIframeHideElements();
            Router.go(Session.get('iframePage'));
        }
    });
});

setIframePageSession = function(pageName) {
    pageName && Session.set('iframePage', pageName);
}
setIframeSessionObj = function() {
    Session.set('iframeObject', {
        lat: bz.help.getParamURL().lat,
        lng: bz.help.getParamURL().lng
    });
}
redirectLinksToShinersRu = function() {
    setTimeout(function() {
        $('a[href^="/post/"]').each((i, a)=> {
            //a.href = 'https://shiners.ru' + a.href.substring(a.href.indexOf('/post'), a.href.length);
            a.href = '#';
        });
    }, 3000);
}

SetIframeEventListeners = () => {
    // Called sometime after postMessage is called
    function receiveMessage(event)
    {
        if (event.data.pagePath) {
            console.log('iframe:receiveMessage', event.data.pagePath)
            // IfIframeHideElements();
            // Router.go(event.data.pagePath);
            setIframePageSession(event.data.pagePath)
        }
        //event.source.postMessage('hi there yourself!  the secret response is: rheeeeet!', event.origin);
    }
    window.removeEventListener('message', receiveMessage);
    window.addEventListener('message', receiveMessage, false);
}
PostMessage = (data) => {
    //console.log('iframe:postMessage', $('body').height(), window.innerHeight, window.outerHeight) ;
    data && window.parent.postMessage(data, '*');//$('body').height()
}
$(document).ready(function() {
    //alert(navigator.userAgent)//very temp!
    if(inIframe()) {
            $('#bz-header').css('display', 'none');
            $('#bz-footer').css('display', 'none');
            setIframeSessionObj();
            SetIframeEventListeners();
            redirectLinksToShinersRu();
    }
    console.log('iframe:doc ready', $('body').height(), window.innerHeight, window.outerHeight) ;
    function inIframe () {
        debugger;
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }
});
Tracker.autorun(function(e){
    if(Meteor.userId()){
        //do your stuff
        PostMessage({
            user: Meteor.user()
        });
    }
    Router.onAfterAction(function() {
        console.log('iframe:router:onAfterAction', $('body').height(), window.innerHeight, window.outerHeight) ;
    })
    if (Router.current() ) {
        PostMessage();
        //window.c = Router.current();
        //c.onStop(function() { console.log('asdf1') });
        //Router.onAfterAction(function() { console.log('asdf') })
    }
});
