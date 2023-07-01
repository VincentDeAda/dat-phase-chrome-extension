import { appendUniqueArrayItems, downloadFile, FiltrationMethod, loadSettings, setSettings } from "../shared/shared.js";
let btn = document.getElementById('btn') as HTMLButtonElement;
let header = document.querySelector('h2') as HTMLElement;
let note = document.getElementById('note') as HTMLElement;
let importBtn = document.getElementById('import') as HTMLElement;
let likesRemoved = document.getElementById('likesRemoved') as HTMLElement;
let likesRemovedList = document.getElementById('likesRemovedList') as HTMLElement;
let count = document.getElementById('count') as HTMLElement;
let vidsUnliked: Video[] = []
const [tab] = await chrome.tabs.query({ lastFocusedWindow: true, active: true });
if (tab != undefined && tab.url == "https://www.youtube.com/playlist?list=LL") {
  importBtn.addEventListener('click', dataImport);
  btn.addEventListener('click', start);

  chrome.runtime.onMessage.addListener((msg, sender, request) => {
    if (msg.msg == 'LikeRemoved') {
      appendLikeRemoved(msg.video);
      count.textContent = vidsUnliked.length.toString();
    }
    if (msg == 'NoMoreVids') {
      stop();
    }
  });
  function dataImport() {
    if (vidsUnliked.length > 0) {
      const file = new Blob([JSON.stringify(vidsUnliked)]);
      downloadFile(file, 'LikesRemoved.json');
    }

  }
  async function start() {
    await chrome.tabs.sendMessage(tab.id!, 'Start');
    btn.textContent = 'Stop'
    btn.removeEventListener('click', start);
    btn.addEventListener('click', stop);

  }
  async function stop() {
    await chrome.tabs.sendMessage(tab.id!, 'Stop')
    btn.textContent = 'Start'
    btn.removeEventListener('click', stop);
    btn.addEventListener('click', start);

  }

  function appendLikeRemoved(vid: Video) {
    const li = document.createElement('li');
    const channelName = document.createElement('label');
    const videoTitle = document.createElement('p');
    channelName.textContent = vid.channel;
    videoTitle.textContent = vid.title;
    li.append(videoTitle, channelName);
    likesRemovedList.append(li);
    vidsUnliked.push(vid);
  }

  const currentState = await chrome.tabs.sendMessage(tab.id!, '');

  count.textContent = currentState.likesRemoved.length;
  currentState.likesRemoved.forEach(appendLikeRemoved);

  if (currentState.isCanceled) {
    btn.textContent = 'Start'
    btn.removeEventListener('click', stop);
    btn.addEventListener('click', start);
  }
  else {
    btn.textContent = 'Stop'
    btn.removeEventListener('click', start);
    btn.addEventListener('click', stop);
  }

}
else if (tab != undefined && tab.url == "https://www.youtube.com/feed/channels") {
  likesRemoved.remove();
  header.textContent = 'Channels Whitelisted'
  btn.innerText = 'Import Subscriptions';
  btn.addEventListener('click', async () => {
    let subs = await chrome.tabs.sendMessage(tab.id!, 'GetSubs') as string[];
    let settings = await loadSettings();
    appendUniqueArrayItems(settings.whitelisted, subs);
    await setSettings(settings);
    count.textContent = subs.length.toString();;
  });
  note.textContent = "Please scroll to the bottom of the page and load every channel before starting to import."
}
else {
  likesRemoved.remove();
  btn.remove();
  count.remove();
  header.textContent = "There's nothing to do on this page.";
  let whitelisted = document.createElement('a');
  whitelisted.text = 'this page ';
  whitelisted.href = 'https://www.youtube.com/feed/channels';
  whitelisted.target = "_blank"
  note.innerHTML = 'Please head to ';
  note.appendChild(whitelisted);
  note.innerHTML += 'to whitelist subscribed channels '
  let liked = document.createElement('a');
  liked.text = 'or this page ';
  liked.href = 'https://www.youtube.com/playlist?list=LL';
  liked.target = "_blank"

  note.appendChild(liked);
  note.innerHTML += "to start removing likes."

}