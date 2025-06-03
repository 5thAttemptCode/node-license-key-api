const express = require("express")
const router = express.Router()
const db = require("../db")
import { sanitizeKey } from "./utils/trimmedKey"


// Route to validate the license key
router.post("/validate", (req, res) => {
  // Extracting the key from the request body.
  const sanitizedKey= sanitizeKey(req.body.key)
  
  // No key provided
  if(!sanitizedKey){
    return res.status(400).json({ 
      valid: false, 
      message: "No license-key provided"})
  }

  // "db.prepare" Calls a method on your SQLite database connection (db) to create a prepared statement.
  // "SELECT * FROM licenses WHERE key = ?" SQL query string. It's asking: "Find all columns (*) from the 
  // licenses table where the key matches... something."
  // "?" placeholder for value we supply later and it also prevents from unwanted behavior
  const stmt = db.prepare("SELECT * FROM licenses WHERE key = ?")
  const license = stmt.get(sanitizedKey)

  if (!license){
    return res.status(403).json({
      valid: false,
      message: "Invalid license key"
    })
  }

  // Check expiration
  const expiration = new Date(license.expires)
  // Ensures to always compare with the real current date
  const now = new Date()

  if(expiration < now){
    return res.status(403).json({
      valid: false,
      message: "License key has expired"
    })
  }

  // Sending result, whether true or false, back to the frotend as JSON
  res.status(200).json({ 
    valid: true, 
    message: "License key is valid"
  })
})

module.exports = router