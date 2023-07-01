import { appendUniqueArrayItems, FiltrationMethod, loadSettings, setSettings } from "../shared/shared.js";
let btn = document.getElementById('btn') as HTMLButtonElement;
let header = document.querySelector('h2') as HTMLElement;
let para = document.querySelector('p') as HTMLElement;
let count = document.getElementById('count') as HTMLElement;
let lRemoved: number = 0;
const [tab] = await chrome.tabs.query({ lastFocusedWindow: true, active: true });

if (tab != undefined && tab.url == "https://www.youtube.com/playlist?list=LL") {


  btn.addEventListener('click', start);

  chrome.runtime.onMessage.addListener((msg, sender, request) => {
    if (msg == 'LikeRemoved') {
      lRemoved++;
      count.textContent = lRemoved.toString();;
    }
    if (msg == 'NoMoreVids') {
      stop();
    }
  });
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



  const currentState = await chrome.tabs.sendMessage(tab.id!, '');

  count.textContent = currentState.likesRemoved;

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
  header.textContent = 'Channels Whitelisted'
  para.remove();
  btn.innerText = 'Import Subscriptions';
  btn.addEventListener('click', async () => {
    let subs = await chrome.tabs.sendMessage(tab.id!, 'GetSubs') as string[];
    let settings = await loadSettings();
    appendUniqueArrayItems(settings.whitelisted, subs);
    await setSettings(settings);
    count.textContent = subs.length.toString();;
  });
}
else {

  btn.remove();
  count.remove();
  header.textContent = "There's nothing to do on this page.";
  para.remove();

}