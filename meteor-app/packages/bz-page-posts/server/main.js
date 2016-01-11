/**
 * Created by arutu_000 on 1/9/2016.
 */
// daily reset 'today viewed' amount:
/*
 Meteor.setInterval(function(){
 //bz.cols.posts.update(post._id, {$set: {'stats.seenToday': 0 }});
 // later.parse.recur().on(8,20).hour();

 }, 86400); // 24 hrs*/
Meteor.startup(function () {

  SyncedCron.add({
    name: 'daily reset "today viewed" amount',
    schedule: function (parser) {
      // parser is a later.parse object
      return parser.text('at 2:29 am');
      //return parser.text('at 0:01 am');
    },
    job: function () {
      console.log('I AM RESETTING THE THING! IT IS MIDNIGHT');
      return bz.cols.posts.update({}, {$set: {'stats.seenToday': 0}}, {multi:true});
    }
  });
  SyncedCron.start();
});
