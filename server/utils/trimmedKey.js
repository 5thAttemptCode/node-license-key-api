function sanitizeKey(key){

  if(typeof key !== "string") return null

  const trimmedKey = key?.trim()

  return trimmedKey.length === 0 ? null : trimmedKey
}

module.exports = sanitizeKey