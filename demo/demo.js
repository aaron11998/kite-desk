/* Kite Desk rule-based demo: client-side only, no network calls, no keys, sends no real messages. */
(function(){
var BIZ={name:"Demo Salon, Al Barsha",hours:"Sat–Thu 10:00–21:00, Fri 14:00–21:00",
 location:"Al Barsha 1, Dubai (sample address for the demo)",
 services:{"haircut":"AED 80","blow dry":"AED 60","hair colour":"AED 250","manicure":"AED 70","pedicure":"AED 90"}};
var log=document.getElementById("kd-log"),form=document.getElementById("kd-form"),input=document.getElementById("kd-input");
var state={step:null,b:{}};
function t(){var d=new Date();return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)}
function add(who,text){var m=document.createElement("div");m.className="kd-msg "+who;m.setAttribute("data-who",who);
 var p=document.createElement("span");p.textContent=text;m.appendChild(p);var s=document.createElement("small");s.textContent=t();m.appendChild(s);
 log.appendChild(m);log.scrollTop=log.scrollHeight}
function priceList(){return Object.keys(BIZ.services).map(function(k){return "• "+k+": "+BIZ.services[k]}).join("\n")}
function findService(x){var k=Object.keys(BIZ.services);for(var i=0;i<k.length;i++){if(x.indexOf(k[i])>-1||x.indexOf(k[i].split(" ")[0])>-1&&k[i]!=="hair colour")return k[i]}
 if(/colou?r/.test(x))return "hair colour";if(/hair ?cut|trim/.test(x))return "haircut";return null}
var has=function(x,re){return re.test(x)};
function reply(raw){var x=raw.toLowerCase().trim();
 if(has(x,/\b(human|person|agent|staff|someone|real|manager|call me)\b/)){state.step=null;
  return "No problem — I’m handing you to a team member at "+BIZ.name+". Someone will reply here shortly. (Demo: no real person is notified.)"}
 if(has(x,/\b(cancel|stop|restart)\b/)&&state.step){state={step:null,b:{}};return "Booking cancelled. Anything else I can help with?"}
 if(state.step==="name"){state.b.name=raw.trim();state.step="service";return "Thanks "+state.b.name+"! Which service would you like?\n"+priceList()}
 if(state.step==="service"){var s=findService(x);if(!s)return "Sorry, I didn’t catch that. Please pick one:\n"+priceList();
  state.b.service=s;state.step="time";return "Great, "+s+" ("+BIZ.services[s]+"). What day and time suits you? e.g. 'Saturday 4pm'"}
 if(state.step==="time"){state.b.time=raw.trim();state.step="confirm";
  return "Please confirm:\nName: "+state.b.name+"\nService: "+state.b.service+"\nTime: "+state.b.time+"\nReply YES to confirm or NO to change."}
 if(state.step==="confirm"){if(has(x,/^(yes|y|confirm|ok|okay|sure)\b/)){var b=state.b;state={step:null,b:{}};
   return "✅ Booked! "+b.name+", your "+b.service+" is confirmed for "+b.time+" at "+BIZ.name+". (Demo booking, nothing was actually reserved.)"}
  state={step:"name",b:{}};return "No problem, let’s start again. What’s your name?"}
 if(has(x,/\b(book|appointment|reserve|slot)\b/)){state={step:"name",b:{}};var s2=findService(x);if(s2)state.b.preService=s2;return "Happy to book you in! What’s your name?"}
 if(has(x,/\b(hours?|open|opening|close|closing|timings?|when)\b/))return "We’re open "+BIZ.hours+".";
 if(has(x,/\b(prices?|costs?|how much|rates?|menu|aed|services?)\b/))return "Our prices:\n"+priceList()+"\nWant to book? Just say 'book'.";
 if(has(x,/\b(where|location|address|map|directions|parking)\b/))return "We’re at "+BIZ.location+".";
 if(has(x,/^(hi|hello|hey|salam|marhaba|good)/))return "Hi! 👋 Welcome to "+BIZ.name+". I can share hours, prices, location, book an appointment, or connect you to a human.";
 return "I can help with: opening hours, prices, location, booking an appointment, or 'talk to a human'."}
function send(text){if(!text.trim())return;add("me",text);var r=reply(text);setTimeout(function(){add("bot",r)},250)}
form.addEventListener("submit",function(e){e.preventDefault();var v=input.value;input.value="";send(v)});
Array.prototype.forEach.call(document.querySelectorAll("[data-kd-quick]"),function(b){b.addEventListener("click",function(){send(b.getAttribute("data-kd-quick"))})});
add("bot","Hi! 👋 Welcome to "+BIZ.name+". Ask about hours, prices, location, say 'book' to make an appointment, or 'talk to a human'.");
window.KiteDeskDemo={reply:reply};
})();
