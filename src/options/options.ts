import { appendUniqueArrayItems, FiltrationMethod, loadSettings, setSettings } from '../shared/shared.js'
const filterSelection = document.getElementById("filterType") as HTMLSelectElement;
const importMethod = document.getElementById("importMethod") as HTMLSelectElement;

const channels = document.getElementById('channels') as HTMLDivElement;
const channelsBtn = document.getElementById('channelsBtn') as HTMLDivElement;
const channelInput = document.getElementById('channelsInput') as HTMLInputElement;

const keywords = document.getElementById('keywords') as HTMLDivElement;
const keywordsBtn = document.getElementById('keywordsBtn') as HTMLDivElement;
const keywordInput = document.getElementById('keywordInput') as HTMLInputElement;

const whitelisted = document.getElementById('whitelisted') as HTMLDivElement;
const whitelistedBtn = document.getElementById('whitelistedBtn') as HTMLDivElement;
const whitelistedInput = document.getElementById('whitelistedInput') as HTMLInputElement;


const importFilterInput = document.getElementById('filterInput') as HTMLInputElement;

const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
const importBtn = document.getElementById('importBtn') as HTMLInputElement;

importFilterInput.addEventListener('keypress', (e) => onEnter(e, () => {
  importFilter((e.target as HTMLInputElement).value);
}));


saveBtn.addEventListener('click', onSave);
exportBtn.addEventListener('click', exportData)
importBtn.addEventListener('change', importData)

whitelistedBtn.addEventListener('click', () => clearEntry(whitelisted, settings.whitelisted));
channelsBtn.addEventListener('click', () => clearEntry(channels, settings.channels));
keywordsBtn.addEventListener('click', () => clearEntry(keywords, settings.keywords));

function exportData() {
  const file = new Blob([JSON.stringify(settings)], { type: "json/application" });
  const anchor = document.createElement('a');
  anchor.download = 'ImportedSettings.json';
  anchor.href = URL.createObjectURL(file);
  anchor.click();
  anchor.remove();
}
async function importData() {
  const file = importBtn.files![0];
  const fileText = await file.text();
  let jsonData: Settings;
  try {
    jsonData = JSON.parse(fileText)
    if (!isSettings(jsonData)) {
      throw null;
    }
  } catch (error) {
    alert('Invalid File');
    return;
  }
  clearEntry(whitelisted);
  clearEntry(keywords);
  clearEntry(channels);
  if (importMethod.value == '1') {
    settings = jsonData;
  }
  else {

    appendUniqueArrayItems(settings.channels, jsonData.channels);
    appendUniqueArrayItems(settings.keywords, jsonData.keywords);
    appendUniqueArrayItems(settings.whitelisted, jsonData.whitelisted);
  }

  appendSettings();

}

let settings = await loadSettings();

assignEntry(channels, channelInput, settings.channels);
assignEntry(keywords, keywordInput, settings.keywords);
assignEntry(whitelisted, whitelistedInput, settings.whitelisted);
filterSelection.value = settings.filter.toString() ?? 3;

appendSettings();


function appendSettings() {
  appendEntries(channels, settings.channels);
  appendEntries(keywords, settings.keywords);
  appendEntries(whitelisted, settings.whitelisted);
}

function onEnter(e: KeyboardEvent, func: () => any) {
  if (e.key == 'Enter') {
    func();
  }
}
function appendEntries(entryGroup: HTMLDivElement, entries: string[]) {
  entries.forEach(x => {
    const li = createListItem(x, entries);
    entryGroup.appendChild(li);
  });
}
function assignEntry(entryGroup: HTMLDivElement, entryInput: HTMLInputElement, collection: string[]) {
  entryInput.addEventListener('keypress', (e) => onEnter(e, () => {
    const isDuplicate = collection.includes(entryInput.value);
    const isValid = entryInput.value.trim().length > 2;
    if (!isDuplicate && isValid) {

      const li = createListItem(entryInput.value, collection);
      collection.push(entryInput.value);
      entryGroup.append(li);
      alertOnClose();

    }
    entryInput.value = '';

  }));

}
function createListItem(entry: string, entries: string[]) {
  const li = document.createElement('li');
  const deletionBtn = document.createElement('button');
  const word = document.createElement('h3');

  deletionBtn.textContent = 'X';
  deletionBtn.classList.add('deletionBtn');
  deletionBtn.addEventListener('click', e => {
    entries.splice(entries.indexOf(entry), 1);
    li.remove();
    alertOnClose();
  })
  word.textContent = entry;
  li.append(deletionBtn, word);
  return li;

}
async function importFilter(url: string) {
  try {
    const response = await fetch(url);
    let parsedResponse = {};
    try {
      parsedResponse = await response.json();
    } catch (e) {
      return;
    }
    if (!isSettings(parsedResponse)) {
      return;
    }
    let method = importMethod.value;
    if (method == "1") {
      clearEntry(channels, settings.channels);
      clearEntry(keywords, settings.keywords);
    }
    settings.channels.push(...parsedResponse.channels);
    settings.keywords.push(...parsedResponse.keywords);
    appendEntries(channels, parsedResponse.channels);
    appendEntries(keywords, parsedResponse.keywords);
  } catch (error) {
    console.log(error);

  }

}
function isSettings(o: any): o is Settings {
  return 'channels' in o && 'keywords' in o && 'whitelisted' in o;
}
async function onSave() {
  settings.filter = filterSelection.value;
  await setSettings(settings);
  window.onbeforeunload = null;
}

function clearEntry<T>(entry: HTMLElement, arr?: T[]) {
  entry.innerHTML = '';
  arr?.splice(0, arr.length)
}
function alertOnClose() {
  window.onbeforeunload = function () {
    return ''
  }

}