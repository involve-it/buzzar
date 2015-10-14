/**
 * Created by Serge on 10/13/2015.
 */
var a = 5; var b = 6;
function generateDataSample(){
    var result =[];
    var imgIndex = 0;
    for (var i = 0; i < 120; i++){

        var item = {};
        item.topText = i + "ft";
        item.headerText = "I want to ride my bycicle i want to ride my bike, I want to ride my bycicle I want to ride it where i like" + i;
        item.bodyText = "I want to ride my bycicle i want to ride my bike, I want to ride my bycicle I want to ride it where i like" + i;
        item.buttonText = "Button " + i;

        item.backgroundImageUrl = "img/" + imgIndex + ".jpg";
        imgIndex++; if (imgIndex>2){imgIndex = 0};

        item.cellBottomButtonFunction = function(){alert("meow!")}
        result.push(item);
    }
    return result;
}
initHoneyComb = function(){
    var insertHoneycombHere = document.getElementById("honeycomb-placeholder");
    var sampleData = generateDataSample();
    honeycomb.createHoneycomb(insertHoneycombHere, sampleData);
}