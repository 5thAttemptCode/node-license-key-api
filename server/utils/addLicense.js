function addLicense(db, key, daysValid = 5){
  
  const createdAt = new Date()
  const expiresAt = new Date(createdAt)
  expiresAt.setDate(createdAt.getDate() + daysValid)

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO licenses (key, created_at, expires_at)
    VALUES (?, ?, ?)
  `)

  const createdAtStr = createdAt.toISOString().replace("T", "").slice(0, 19)
  const expiresAtStr = expiresAt.toISOString().replace("T", "").slice(0, 19)

  stmt.run(key, createdAtStr, expiresAtStr)
  console.log(`✅ License ${key} inserted`)
  
  return { db, key, daysValid }
}

module.exports = addLicense