const LENGTH = 'YYYY-MM-DD'.length
const ONE_DAY = 86400000 // in ms

/**
 * Returns the date that occurred one day before the input date.
 *
 * @param {string} day - The input date as a string in the 'YYYY-MM-DD' format.
 * @returns {string} The date that occurred one day before the input date.
 * @throws {Error} If the input date is not a valid date.
 */
const getDayBefore = (day: string): string => {
  const date = new Date(day)

  if (!Number.isFinite(date)) {
    throw new Error(`${day} is not a valid date`)
  }

  const dayBefore = new Date(date - ONE_DAY)

  return dayBefore.toISOString().slice(0, LENGTH)
}


export default getDayBefore
