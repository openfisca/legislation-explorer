export default function getDayBefore(day) {
  const ONE_DAY = 86400000 // in ms
  return new Date(Date.parse(day) - ONE_DAY).toISOString().slice(0, "YYYY-MM-DD".length)
}
