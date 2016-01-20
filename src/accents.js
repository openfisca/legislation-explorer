function withoutAccents(str) {
  const accentsByChar = {
    "a": "[àáâãäå]", "ae": "æ", "c": "ç", "e": "[èéêë]", "i": "[ìíîï]", "n": "ñ", "o": "[òóôõö]", "oe": "œ",
    "u": "[ùúûűü]", "y": "[ýÿ]",
  }
  return Object.entries(accentsByChar).reduce(
    (memo, [char, accents]) => memo.replace(new RegExp(accents, "g"), char),
    str
  )
}


export default {withoutAccents}
