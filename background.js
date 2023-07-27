const userId = 87184624;
const clientId = 'hjyiocqe0oold2ia4r8fnlwuptwxir';
const clientId2 = 'gp762nuuoqcoxypju8c569th9wz7q5';
const token = 'dtms5schcbxrdvt6v6vb8jnkcypbif';
const token2 = '0tyhpuj4j1rpzlp630zzwxpvzm18ji';
const token2023 = '8ev9mjubat4f5zqwzkpw0lsxhav1lz'

const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
const twitchURL = 'https://twitch.tv/zacknani'
const headers = {
  'Authorization': `Bearer ${token2023}`,
  'Client-Id': clientId
}

function sendTwitchNotification(liveTitle) {
  chrome.notifications.create('LiveOn', {
    title: 'Zack est en live !',
    iconUrl: './icons/icon32.png',
    type: 'basic',
    message:  `${liveTitle}`
});
}

function turnOffIcon() {
  setIcon('icons/icon32off.png');
  chrome.action.setBadgeText({ text: ''});
}

function turnOnIcon() {
  setIcon('icons/icon32.png');
  chrome.action.setBadgeText({text: '1'});
  chrome.action.setBadgeBackgroundColor({color: '#000'});
  
}

function setLiveOn(liveTitle) {
  chrome.storage.local.set({ "liveIsOn": true }, function() {
    sendTwitchNotification(liveTitle);
    turnOnIcon();
  });
}

function setLiveOff() {
  chrome.storage.local.set({ "liveIsOn": false }, function() {
    turnOffIcon()
  });
}

const callback = function(json) {
  if (!json.data) {
    console.log('y\'a une couille')
    return
  }

  chrome.storage.local.get("liveIsOn").then((results) => {
    let liveIsOn = results.liveIsOn;

    if (json.data.length && !liveIsOn) {
      setLiveOn(json.data[0].title)
    } else if (liveIsOn && json.data.length == 0) {
      setLiveOff()
    }

  })
}

function fetchTwitchAPI(url, headers, callback){
  fetch(url, { headers: headers}).then((response) => {
    console.log(response)
    return response.json();
  }).then((json) => callback(json));
}

function setIcon(path) {
    chrome.action.setIcon({ path: path });
}

fetchTwitchAPI(url, headers, callback)

chrome.notifications.onClicked.addListener(() => {
    chrome.tabs.create({
        url : twitchURL
    })
});


chrome.alarms.create({ periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(() => {
    fetchTwitchAPI(url, headers, callback);
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setBadgeText') {
    chrome.action.setBadgeText({ text: message.text });
  }
});
