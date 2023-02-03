interface Settings {
  keywords: string[],
  channels: string[],
  whitelisted: string[],
  filter: FiltrationMethod,
  delay: number
}
interface Video {
  title: string,
  channel: string,
}