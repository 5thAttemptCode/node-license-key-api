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

// Creating an admins authentication table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    adminName TEXT UNIQUE NOT NULL,
    adminPassword TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS logs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    adminName TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    action TEXT NOT NULL,
    details
  )
`)

module.exports = db