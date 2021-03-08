export const getLocalStringFromTimeStamp = (timestamp: string, locale: string = "en-US") => {
  const days: { [key: number]: string} = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat'
  }
  const date = new Date(timestamp);
  const day = date.getDay();
  const localDate = date.toLocaleDateString(locale);
  const localTime = date.toLocaleTimeString(locale);
  return `${days[day]} ${localDate} @ ${localTime}`;
}