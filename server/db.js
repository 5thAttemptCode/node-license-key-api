// Importing library
const Database = require("better-sqlite3")

// Creating new database
const db = new Database("license.db")

// Creating a licenses table with key, created_at, and expires_at columns
db.exec(`
  CREATE TABLE IF NOT EXISTS licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
  )
`)

module.exports = db