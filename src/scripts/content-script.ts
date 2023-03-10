
let content: HTMLElement;
let settings: Settings;
let scripts: any;
let likesRemoved: Video[] = [];

let hasLoadedAll: boolean = false;
let attempts: number = 0;
let isCanceled = true;
let currentVideo: HTMLElement;
let hasLoaded = false;
let filterFunction: ((vid: Video) => boolean);




(async () => {
  let url = await chrome.runtime.getURL('./shared/shared.js')
  scripts = await import(url);

  settings = await scripts.loadSettings() as Settings;
  settings.keywords = settings.keywords.map(x => x.toLowerCase());
})();


chrome.runtime.onMessage.addListener(async (msg, sender, response) => {
  switch (msg) {
    case 'Start':
      isCanceled = false;
      startUp();
      break;
    case 'Stop':
      isCanceled = true;
      break;
    case "GetSubs":
      const arr = Array.from(document.querySelectorAll('#text')).map(x => x.textContent);
      await response(arr);
      break;
    default:
      await response({ likesRemoved, isCanceled })
      break;
  }
});
function setupFilter() {
  switch (settings.filter) {
    case "0":
      filterFunction = (vid) => !checkWhitelisted(vid) && checkKeywords(vid);
      break;
    case "1":
      filterFunction = (vid) => !checkWhitelisted(vid) && checkChannel(vid);
      break;
    case "2":
      filterFunction = (vid) => !checkWhitelisted(vid) && (checkChannel(vid) || checkKeywords(vid));
      break;
    case "3":
      filterFunction = (vid) => !checkWhitelisted(vid);
      break;
    default:
      filterFunction = (_) => true;
      break;
  }
}
function deconstructVideoData(vodElement: Element) {
  let video: Video = {
    title: vodElement?.querySelector('#video-title')?.textContent?.trim()!,
    channel: vodElement?.querySelector('#channel-name')?.querySelector('a')?.innerText.trim()!
  }

  return video;
}

function assignContent() {
  do {
    content = document.querySelector('#contents #contents #contents')! as HTMLElement;
  }
  while (content == undefined);
  currentVideo = content.querySelector('.style-scope.ytd-playlist-video-list-renderer')!;
}

async function findNextVid() {

  let temp: HTMLElement = currentVideo.nextElementSibling as HTMLElement;


  while (temp == undefined) {
    temp = currentVideo.nextElementSibling as HTMLElement;
    attempts++;

    await scripts.sleep(5 * 1000);
    if (attempts >= 10) {
      notifyNoMoreVids();
      return;
    }
  }
  currentVideo?.remove();
  currentVideo = temp;
  attempts = 0;
}
async function notifyNoMoreVids() {
  isCanceled = true;
  attempts = 0;
  alert("Can't Find more videos.");
  await chrome.runtime.sendMessage('NoMoreVids');
}
function checkChannel(vid: Video) {
  if (!vid.channel) {
    return false;
  }
  return settings.channels.includes(vid.channel);
}
function checkKeywords(vid: Video) {
  if (!vid.title) {
    return false;
  }

  let lowerTitle = vid.title.toLowerCase();
  for (const word in settings.keywords) {
    if (lowerTitle.includes(settings.keywords[word])) {
      return true;
    }
  }
  return false;
}
function checkWhitelisted(vid: Video) {
  return settings.whitelisted.includes(vid.channel);
}

async function removeLike(vid: Element) {
  const menu = vid.querySelector('#menu') as HTMLElement;
  const dropdownBtn = menu.querySelector('#button') as HTMLElement;
  dropdownBtn.click()

  await scripts.sleep(600)


  const buttons = document.querySelectorAll('ytd-menu-service-item-renderer');
  const dislikeBtn = buttons[buttons.length - 1] as HTMLElement;
  dislikeBtn.click();
}

function sendNewLikeRemoved(vid: Video) {
  likesRemoved.push(vid);
  chrome.runtime.sendMessage({ msg: "LikeRemoved", video: vid });
}

async function startUp() {
  if (isCanceled) return;
  if (!hasLoaded) {

    assignContent();
    hasLoaded = true;
  }
  setupFilter();
  while (!isCanceled) {
    let video = deconstructVideoData(currentVideo);

    let isBadVideo = filterFunction(video);
    if (isBadVideo) {
      sendNewLikeRemoved(video);
      await removeLike(currentVideo);
    }
    await findNextVid();
    await scripts.sleep(settings.delay);
  }


}
