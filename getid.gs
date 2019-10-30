function doPost(e) {
 
  var CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_TOKEN';
  var msg = JSON.parse(e.postData.contents);
  console.log(msg);
 

  var replyToken = msg.events[0].replyToken;
  var userMessage = msg.events[0].message.text;
  var userId = msg.events[0].source.userId;
  var groupId = msg.events[0].source.groupId;
  if (typeof replyToken === 'undefined') {
    return;
  }
 
  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
      'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': userId+'\n'+groupId,
      }],
    }),
  });
}
