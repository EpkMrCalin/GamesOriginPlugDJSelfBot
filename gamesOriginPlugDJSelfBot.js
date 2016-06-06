/** GNU GPLv3 Licensing :
Christian BUISSON French Developper contact by electronic mail: hybris_95@hotmail.com
Copyright © 2014 Christian BUISSON

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software Foundation,
    Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA
*/

/** USAGE :
 ** Usage Method :
 ** copy/paste the entire script into the Firefox/Chrome Console (Ctrl+Shift+C Shortcut)
*/

/**
 * Global Vars
 */
var debug = false;

var maxDuration = 330;// in Seconds
var maxDurationOfficial = 5;// in Minutes
var maxDurationMessage = "Attention à la durée @%pseudo%, %maxDurationOfficial% minutes maximum";

var earlyLevel = 1;// Under this level you are considered as a newbie
var earlyLevelMessage = "Bienvenue @%pseudo% si tu as des questions n'hésites pas.";

var autoMsgCycling = 15;// in Minutes
var autoMsgCyclingMessage = "Petit rappel : la durée maximale toléré pour une musique est de %maxDurationOfficial% minutes, essayer de respecter cette durée, merci !";

var cmdCheck = "!tuto";// This command generates an automatic message
var cmdCheckMessage = "http://myreader.toile-libre.org/uploads/My_5752eb05cc198.pdf";


/**
 * ADVANCE EVENT :
 * MaxDurationCheck
 */
var advanceEventHookedOnApi;
var advanceFunction;
if(advanceFunction && advanceEventHookedOnApi){
    API.off(API.ADVANCE, advanceFunction);
    advanceEventHookedOnApi = false;
}
advanceFunction = function(data) {
    if(debug){console.log("Advance event");console.log(data);}
    
	if(data.media.duration >= maxDuration)
	{
		var transformedMaxDurationMessage = maxDurationMessage.replace("%pseudo%", data.dj.username).replace("%maxDurationOfficial%", maxDurationOfficial);
		API.sendChat(transformedMaxDurationMessage);
	}
};
if(!advanceEventHookedOnApi){
    API.on(API.ADVANCE, advanceFunction);
    advanceEventHookedOnApi = true;
}

/**
 * JOIN EVENT :
 * CheckEarlyLevels
 */
var joinHookedOnApi;
var someoneJoined;
if(someoneJoined && joinHookedOnApi){
    API.off(API.USER_JOIN, someoneJoined);
    joinHookedOnApi = false;
}
someoneJoined = function(user){
    if(debug){console.log("Join event");console.log(user);}
	
    if(user.level <= earlyLevel)
	{
		var transformedEarlyLevelMessage = earlyLevelMessage.replace("%pseudo%", user.username);
		API.sendChat(transformedEarlyLevelMessage);
	}
};
if(!joinHookedOnApi){
    API.on(API.USER_JOIN, someoneJoined);
    joinHookedOnApi = true;
}

/**
 * CHAT EVENT :
 * AutoNotice Only -> http://pastebin.com/Hsi2YMDH
 */
var chatEventHookedOnApi;
var analyseChat;
if(analyseChat && chatEventHookedOnApi){
    API.off(API.CHAT, analyseChat);
    chatEventHookedOnApi = false;
}
analyseChat = function(chat){
    if(debug){console.log("Chat event");console.log(chat);}
    var message = chat.message;
    var username = chat.un;
    var type = chat.type;
    var uid = chat.uid;
    var cid = chat.cid;
    var timestamp = chat.timestamp;
    
	if(message == cmdCheck)
	{
		API.sendChat(cmdCheckMessage);
	}
};
if(!chatEventHookedOnApi){
    API.on(API.CHAT, analyseChat);
    chatEventHookedOnApi = true;
}

/**
 * CYCLIC EVENT
 */
var cycleEvent;
cycleEvent = function(){
	var transformedAutoMsgCyclingMessage = autoMsgCyclingMessage.replace("%maxDurationOfficial%", maxDurationOfficial);
	API.sendChat(transformedAutoMsgCyclingMessage);
	setTimeout(cycleEvent, autoMsgCycling * 60 * 1000);
};

/**
 * Main function (executed at loading)
 */
function main(){
    setTimeout(cycleEvent, autoMsgCycling * 60 * 1000);
}
$(document).ready(main);
