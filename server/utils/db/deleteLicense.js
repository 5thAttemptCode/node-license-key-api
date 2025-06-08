function deleteLicense(db, key){
  const stmt = db.prepare("SELECT 1 FROM licenses WHERE key = ?")
  const exists = stmt. get([ key ])

  if(!exists){
    return{
      success: false,
      message: "License key not found"
    }
  }

  const deleteStmt = db.prepare("DELETE FROM licenses WHERE key = ?")
  deleteStmt.run([ key ])

  return{
    success: true
  }
}

module.exports. deleteLicense