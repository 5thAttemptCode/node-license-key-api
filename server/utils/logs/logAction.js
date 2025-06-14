function logAction(adminName, action, details){
  
  const createdAt = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO logs (adminName, action, details, createdAt)
    VALUES (?, ?, ?, ?)
  `)
  stmt.run(adminName, action, details, createdAt)
}

module.exports = logAction