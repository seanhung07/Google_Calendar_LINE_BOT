var CHANNEL_ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";
var calendarID = "EMAIL";
var myID = "YOUR_ID_YOU CAN USE GETID BOT TO GET YOUR ID";

var　calendar　=　CalendarApp.getCalendarById(calendarID);
var　nowTime　=　new　Date();
var　startTime　=　new　Date(nowTime.getFullYear(),　nowTime.getMonth(),　nowTime.getDate(),　0,　0,　0,　0);
var　endTime　=　new　Date(nowTime.getFullYear(),　nowTime.getMonth(),　nowTime.getDate(),　23,　59,　59,　999);
var　calendarData　=　calendar.getEvents(startTime,　endTime);


function　doPost(e)　{
　　var　userData　=　JSON.parse(e.postData.contents);
　　console.log(userData);
　　var　clientID　=　userData.events[0].source.userId;
　　if　(clientID　!=　myID)　{return;}
　　stopAlarm();
}


function　stopAlarm()　{
　　calendarData.forEach(function　getAlarmData(item,　index,　array){
　　　　　　if　(new　Date(item.getStartTime()　-　item.getPopupReminders()　*　60　*　1000)　<　nowTime　&&　item.getTag("Confirmed")　!=　"Yes")　{
　　　　　　　　item.setTag("Confirmed",　"Yes");
　　　　　　}
　　　　}
　　)
}


function　getCalendarData()　{
　　var　LineBotAlarmData　=　[];
　　calendarData.forEach(function　getAlarmData(item,　index,　array){
　　　　　　if　(new　Date(item.getStartTime()　-　item.getPopupReminders()　*　60　*　1000)　<　nowTime　&&　item.getTag("Confirmed")　!=　"Yes")　{
　　　　　　　　LineBotAlarmData.push(item);
　　　　　　}
　　　　}
　　)

　　if　(LineBotAlarmData.length　>　0)　{
　　　　var　pushContents　=　"";
　　　　for　(var　i　=　0;　i　<　LineBotAlarmData.length;　i++)　{
　　　　　　pushContents　+=　"*"　+　LineBotAlarmData[i].getTitle()　+　"*\n\n";
　　　　　　var　eventStartTime　=　new　Date(LineBotAlarmData[i].getStartTime());
　　　　　　var　eventEndTime　=　new　Date(LineBotAlarmData[i].getEndTime());
　　　　　　pushContents　+=　"時間："　+　appendAMPM(eventStartTime.getHours())　+　":"　+　appendZero(eventStartTime.getMinutes());
　　　　　　if　(LineBotAlarmData[i].getLocation()　!=　"")　{pushContents　+=　"\n\n地點："　+　LineBotAlarmData[i].getLocation();}
　　　　　　if　(i　!=　LineBotAlarmData.length　-　1)　{pushContents　+=　"\n\n\n";}
　　　　}

　
　　　　for　(var　i　=　0;　i　<　5;　i++)　{
　　　　　　pushMessage(CHANNEL_ACCESS_TOKEN,　myID,　pushContents);
　　　　　　Utilities.sleep(1000);
　　　　}
　　}
}


function　pushMessage(CHANNEL_ACCESS_TOKEN,　userID,　pushContent)　{
　　var　url　=　'https://api.line.me/v2/bot/message/push';
　　UrlFetchApp.fetch(url,　{
　　　　'headers':　{
　　　　　　'Content-Type':　'application/json;　charset=UTF-8',
　　　　　　'Authorization':　'Bearer　'　+　CHANNEL_ACCESS_TOKEN,
　　　　},
　　　　'method':　'post',
　　　　'payload':　JSON.stringify({
　　　　　　'to':　userID,
　　　　　　'messages':　[{
　　　　　　　　'type':　'text',
　　　　　　　　'text':pushContent,
　　　　　　}],
　　　　}),
　　});
}


function　appendZero(obj)　{
　　if　(obj　<　10)　{return　"0"　+""+　obj;}
　　else　{return　obj;}
}


function　appendAMPM(obj)　{
　　if　(obj　<　12)　{return　"上午　"　+""+　obj;}
　　else　if　(obj　==　12)　{return　"中午　"　+""+　obj;}
　　else　{return　"下午　"　+""+　(obj　-　12);}
}
