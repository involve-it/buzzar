/**
 * Created by arutu on 1/9/2016.
 */
VkPostParser = function(body, url) {
}

CatchAllPostParser = function (body, url){
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
}