var template = `
<div name="test">
    hello world
</div>
`
Router.map(function () {

    this.route('test', {
        path: '/',
        onBeforeAction: ()=>{
            $('body').append(template)
        }
    });

});


// test loc:
var loc1 = {
    lat: 52.6031,
    lng: 39.5708,
    radius: 1000
}
Meteor.call('bz.user.getUsersAround',loc1, (er, res)=>{
    debugger;
})
