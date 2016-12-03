/**
 * Created by c_aarutyunyan on 12/2/16.
 */
// see https://github.com/benjick/meteor-telegram-bot/blob/fa7d2071cf934a33dc9959887ba985a9ddd12ec2/telegram-bot.js
Meteor.startup(() => {

  TelegramBot.token = '311127101:AAFFribgKoIBl4U6UFScpyS6Ceqg81YEkUA';

  TelegramBot.start();
  TelegramBot.addListener('incoming_location', function(command, username, messageraw) {
    var posts = GetNearbyPosts(messageraw.location);
    // var res1 = TelegramBot.send('Please provide location', messageraw.chat.id);
    var res = TelegramBot.send(posts, messageraw.chat.id);
  }, 'location')
  TelegramBot.addListener('incoming_document', function(command, username, messageraw) {
    debugger;

  }, 'document')
  TelegramBot.addListener('/posts', function(command, username, messageraw) {
    var posts = GetNearbyPosts();
    // var res1 = TelegramBot.send('Please provide location', messageraw.chat.id);
    var res = TelegramBot.send(posts, messageraw.chat.id);
  });

  TelegramBot.addListener('/start', function(command, username, messageraw) {
    saveChatId(messageraw.chat);

    TelegramBot.startConversation(username, messageraw.chat.id, function(username, message, chat_id) {
      var obj = _.find(TelegramBot.conversations[chat_id], obj => obj.username == username);
      switch(obj.stage) {
        case 0:
          obj.personName = message;
          TelegramBot.send('Cool. What\'s your height?', chat_id);
          obj.stage++;
          break;

        case 1:
          obj.personHeight = message;
          // Sample markdown support - name will be bold
          TelegramBot.send('Nice. What do you work as, *' + obj.personName + '*?', chat_id, true);
          obj.stage++;
          break;

        case 2:
          obj.personJob = message;
          TelegramBot.send('Nice to meet you, ' + obj.personHeight + '-tall ' + obj.personJob + ' ' + obj.personName + '!', chat_id);
          break;
      }
      console.log('Conversation Status: ' + obj);
    }, {stage: 0, personName: "", personHeight: "", personJob: ""} );
    // The return in this listener will be the first prompt
    return `Welcome to Shiners World! We'll try to keep you posted on new posts :) \n
      Please use command '/posts', or simply send us your location to get closest live posts around!`;
  });
  TelegramBot.setCatchAllText(true, function(a, b, c) {
    debugger;
  })
  TelegramBot.poll();
});



AddNewPost = function(post) {
  bz.cols.telegramChats.find().fetch().forEach(c => {
    var res = TelegramBot.send(`New post created! \n ${ post.details.title }:  ${ post.details.description }`, c.chat.id);
  })
}
// private

function saveChatId(chat) {
  if (!bz.cols.telegramChats.findOne({ 'chat.id': chat.id })) {
    bz.cols.telegramChats.insert({
      chat: chat
    })

  }
}
//AGGRRR: https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once