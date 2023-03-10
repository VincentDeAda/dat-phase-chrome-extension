export enum FiltrationMethod {
  KeywordsOnly = 0,
  ChannelsOnly = 1,
  Both = 2,
  AnythingNotWhitelisted = 3,
  NoFilter = 4,
}
export async function loadSettings() {
  return await chrome.storage.sync.get({
    keywords: [],
    channels: [],
    whitelisted: [],
    filter: 0,
    delay: 500

  }) as Settings;
}
export function downloadFile(file: Blob, fileName: string) {
  const anchor = document.createElement('a');
  anchor.download = fileName;
  anchor.href = URL.createObjectURL(file);
  anchor.click();
  anchor.remove();
}
export async function setSettings(settings: Settings) {
  await chrome.storage.sync.set(settings);
}
export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function appendUniqueArrayItems<T>(arr: T[], newArr: T[]) {
  if (!newArr) {
    return;
  }
  newArr.forEach(x => appendUniqueItem(arr, x));
}
export function appendUniqueItem<T>(arr: T[], item: T) {
  if (!arr.includes(item)) {
    arr.push(item)
  }
}