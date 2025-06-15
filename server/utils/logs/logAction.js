function logAction(adminName, action, details){
  
  try{
    const createdAt = new Date().toISOString()
    const stmt = db.prepare(`
      INSERT INTO logs (adminName, action, details, createdAt)
      VALUES (?, ?, ?, ?)
    `)
    stmt.run(adminName, action, details, createdAt)
  } catch(err){
    console.error("Failes to log action: ", err)
  }
}

function safeLogAction(req, action, details){
  // "unkown" as backup to prevent somethin from breaking
  const adminName = req.admin?.adminName || "unknown"
  logAction(adminName, action, details)
}

module.exports = { 
  logAction: logAction, 
  safeLogAction: safeLogAction 
}