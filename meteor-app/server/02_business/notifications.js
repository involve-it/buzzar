/**
 * Created by c_aarutyunyan on 12/29/16.
 */
var Notifications = {}
bz.bus.notifications = Notifications;

/*bz.cols.messages.after.insert(function (userId, doc) {

})*/


var emailOptions = function(data) {
  data = data || {}
  return {
    from: 'info@shiners.ru',
    to: 'bots@shiners.ru',
    //cc: 'arutune@gmail.com,yury.dorofeev@gmail.com,',
    subject: `Shiners - Bot Notification! ${ data.title }`,
    html: `<h1>${ data.title }</h1><p>${ data.msg }</p>
        <br> Please contact <a href="${ Meteor.absoluteUrl() }user/${ data.userId }">this user</a> 
        or email: <a href="mailto:${ data.email }"> ${ data.email }</a>`
  }
}
Notifications.push = function(options) { // userId, title, msg, payload, user
  Notifications.sendEmail(options);
}
Notifications.sendEmail = function (options ) {
  options = options || {}
  var data = {
    header: options.header,
    title: options.title,
    msg: options.msg,
    email: options.user && options.user.email,
    userId: options.userId
  }
  Email.send(emailOptions(data));
}

Notifications.sendEmailToClubAdmins = function (options, clubId ) {
  // todo: after we add clubs,
    Meteor.users.find({ 'profile.type': bz.const.userTypes.admin }).fetch().forEach((i) => {
        Notifications.sendEmail(_.extend({
            user: { email: i.emails && i.emails[0] && i.emails[0].address },
            username: i.username,
            userId: i._id
        }, options))
    })
}