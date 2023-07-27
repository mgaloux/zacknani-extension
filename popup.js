const userId = 87184624;
const token = 'dtms5schcbxrdvt6v6vb8jnkcypbif';
const token2 = '0tyhpuj4j1rpzlp630zzwxpvzm18ji';
const token2023 = '8ev9mjubat4f5zqwzkpw0lsxhav1lz';
const clientId = 'hjyiocqe0oold2ia4r8fnlwuptwxir';
const clientId2 = 'gp762nuuoqcoxypju8c569th9wz7q5';
const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`;

const streamStatus = document.getElementById('streamStatus');
const twitchContentHeader = document.getElementById('twitchContentHeader');
const twitchContentTitle = document.getElementById('twitchContentTitle');
const twitchContent = document.getElementById('twitchContent');
const titleLogo = document.getElementById('titleLogo');
const youtubeTitle = document.getElementById('youtubeTitle');
const youtubeVideoLink = document.getElementById('youtubeVideoLink');
const youtubeThumbnail = document.getElementById('youtubeThumbnail');
const buttonTwitchMessage = document.getElementById('buttonTwitchMessage');

const headers = {
  'Authorization': `Bearer ${token2023}`,
  'Client-Id': clientId
}

function setIcon(path) {
  chrome.runtime.sendMessage({ action: "setIcon", path: "icons/icon32off.png" });
}

const callback = function(json) {
  if (json == undefined) {
    console.log('y\'a une couilleee')
    return
  }

  if (!json?.data?.length) {
    setIcon('icons/icon32off.png');
    titleLogo.src = 'icons/icon48off.png'
  }
  streamStatus.innerHTML = json?.data?.length ? "EN LIVE" : "OFFLINE";
  twitchContentHeader.innerHTML = json?.data?.length ? "ON AIR" : "LIVES RÉCENTS"
  twitchContentTitle.innerHTML = json?.data?.length ? json.data[0].title : "Toutes les rediffusions disponibles ici !"
  twitchContent.style.borderColor = json?.data?.length ? '#FC5D0C' : '#BEB9B6';
  buttonTwitchMessage.innerHTML = json?.data?.length ? "REGARDE SUR" : '&nbsp VOD DISPO SUR' 
}

function fetchTwitchAPI(url, headers, callback){
  fetch(url, { headers: headers}).then((response) => {
    return response.json();
  }).then((json) => callback(json));
}

//////////////

// YOUTUBE 

//////////////

// Replace CHANNEL_ID with the ID of the YouTube channel
const CHANNEL_ID = "UCSJxne19pJyW7l7HjHM-LRg";

// Your API key for the YouTube Data API
const API_KEY = "AIzaSyAx4dUh6FavTnL3-D-UsY9CeYRDA4NVv9E";

// URL for the YouTube Data API
const API_URL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=1`;

// Make a GET request to the API
fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    // Get the video ID of the last video on the channel
    const videoLink = 'https://www.youtube.com/watch?v=' + data.items[0].id.videoId;
    const title = data.items[0].snippet.title;
    const thumbnailUrl = data.items[0].snippet.thumbnails.high.url;
    youtubeTitle.innerHTML = title? title : '';
    youtubeVideoLink.href = videoLink;
    youtubeThumbnail.src = thumbnailUrl;
  })
  .catch(error => {
    console.error(error);
  });

fetchTwitchAPI(url, headers, callback)

//

