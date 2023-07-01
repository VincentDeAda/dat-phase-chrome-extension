interface Settings {
  keywords: string[],
  channels: string[],
  whitelisted: string[],
  filter: FiltrationMethod,
}
interface Video {
  title: string,
  channel: string,
}