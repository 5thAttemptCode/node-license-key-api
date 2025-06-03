const express = require("express")
const router = express.Router()
const db = require("../db")
const verifyToken = require("../authMiddleware")
import { sanitizeKey } from "../utils/trimmedKey"


// Editing route for license key and days-valid
router.put("/admin/license", verifyToken, (req, res) => {
  const oldKey = sanitizeKey(req.body.oldKey)
  const newKey = sanitizeKey(req.body.newKey)
  const daysValid = req.body.daysValid

  // Validate input
  if(!oldKey){
    return res.status(400).json({
      error: true,
      message: "Missing old license key"
    })
  }

  // Check if old key exist
  const existing = db.prepare("SELECT * FROM licenses WHERE key = ?").get(oldKey)
  
  if(!existing){
    return res.status(404).json({
      error: true,
      message: "License key does not exist"
    })
  }

  // If newKey is provided, check if it already exist (duplicates)
  // If a new license key was provided AND it's different from the existing one
  if(newKey && newKey !== oldKey){
    const conflict = db.prepare("SELECT 1 FROM licenses WHERE key = ?").get(newKey)
    if(conflict){
      return res.status(409).json({
        error: true,
        message: "New license key already exists"
      })
    }
  }

  // Build dynamic SET clause 
  // These arrays will dynamically build the SQL statement and the values for it fx: updates = ["key = ?", "expires = ?"]
  const updates = []
  const params = []

  // If the key is changing, add "key = ?" to the update list, and push the new key into the params array
  if(newKey && newKey !== oldKey){
    updates.push("key = ?")
    params.push(newKey)
  }

  // If daysValid is provided, calculate the new expiry date and add it to the update.
  if(typeof daysValid === "number"){
    const expires = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString()
    updates.push("expires = ?")
    params.push(expires)
  }

  // If no newKey or daysValid is entered, don’t run the update at all.
  if(updates.length === 0){
    return res.status(400).json({
      error: true,
      message: "Nothing to update. Provide newKey or daysValid."
    })
  }

  // Run update - Joins the SQL SET clause together fx: UPDATE licenses SET key = ?, expires = ? WHERE key = ?
  const updateQuery = `UPDATE licenses SET ${updates.join(", ")} WHERE key = ?`
  // Add the original key at the end, for the WHERE key = ? part
  params.push(oldKey)
  db.prepare(updateQuery).run(...params)

  // spread operator to avoid manually writing values
  res.status(200).json({
    message: "License key updated successfully",
    ...(newKey ? { key: newKey } : {}),
    ...(typeof daysValid === "number" ? { expires: new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString() } : {})
  })
})

module.exports = router