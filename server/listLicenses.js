const db = require ("./db")

// Prepare the statement
// In better-sqlite3, the .prepare(...) method returns a statement, and then add it to all()
const stmt = db.prepare("SELECT * FROM licenses")

// Run the statement
const rows = stmt.all()

// Log the result
rows.forEach((row) => {
  console.log(row)
})

// Close db - its important to prevent unwanted db behavior like memory leak etc
db.close()