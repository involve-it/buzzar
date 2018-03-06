Template.bzPostsNewFormAd.rendered = function () {
    Router.AddHooksToCheckFormSaved();

    // debugger;
    setTimeout(function(){
        // let's lazy-load code mirror plugin:
        bz.ui.initCodeMirror($('.js-post-description'));
    }, 100);
};


Template.bzPostsNewFormAd.helpers({
    getImagesArrayReactive: function() {
        return {
            imagesArr: imagesArrayReactive
        }
    }
});
