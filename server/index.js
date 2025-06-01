// Importing libraries
const express = require("express")
const cors = require("cors")
const db = require("./db")
const verifyToken = require("./authMiddleware")
import { addLicense } from "./utils"
import { sanitizeKey, sanitizeKey, sanitizeKey } from "./utils/trimmedKey"

const app = express()
const PORT = 3000

// Allows the frontend to make requests
app.use(cors())
// Tells Express to automatically parse JSON in incoming requests. Without this, req.body would be undefined.
app.use(express.json())


// Route to validate the license key
app.post("/validate", (req, res) => {
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

app.listen(PORT, () => {
  console.log(`✅ License server is running at http://localhost:${PORT}`)
})


// Route for checking if server is up and db connection
app.get("/health", (req, res) => {
  try{
    // Running a simple query on db - SELECT 1 is safe dummy query
    const stmt = db.prepare("SELECT 1")
    // This will throw an error if the DB connection is broken
    stmt.get()

    // If everything works
    res.status(200).json({
      status: "ok",
      db: "connected"
    })
    // If something went wrong
  } catch(error){
    console.error("Health check failed: ", error.message)
    res.status(500).json({
      status: "fail",
      db: "disconnected",
      error: error.message
    })
  }
})


// Route for admin to get license keys
app.get("/admin/licenses", verifyToken, (req, res) => {
  try{
    const expired = (req.query.expired || "").toString().toLowerCase()
    const stmt = db.prepare(
      expired === "true"
      ? "SELECT * FROM licenses WHERE expires_at < datetime('now')"
      : "SELECT * FROM licenses WHERE expires_at >= datetime('now')"
    )
    const licenses = stmt.all()
    // Wrap the json response in {} standard API shape
    // (licenses) works too, returns an array with all db rows
    res.json({ licenses })
  } catch(error){ 
    console.error(error)
    res.status(500).json({
      error: true,
      message: "Failed to fetch licenses"
    })
  }
})


// Route for admin to add license key
app.post("/admin/license", verifyToken, (req, res) => {
  const cleanedKey = sanitizeKey(req.body.key)
  const daysValid = req.body.daysValid ?? 5

  //Input validation
  if(!cleanedKey){
    return res.status(400).json({
      error: true,
      message: "Invalid or missing license key"
    })
  }

  if(typeof daysValid !== "number" || isNaN(daysValid)) {
    return res.status(400).json({
      error: true,
      message: "Invalid daysValid value"
    })
  }

  try{
    const stmt = db.prepare("SELECT 1 FROM licenses WHERE key = ? LIMIT 1")
    const keyExist = stmt.get([ cleanedKey ]) // ?(positional parameters) - pass values as an array
   
    if(keyExist){
      return res.status(409).json({
        error: true,
        message: "License key already exist"
      })
    }
    
    addLicense(db, cleanedKey, daysValid)
    res.status(200).json({
      message: `${key} added to Database`
    })
  
  } catch(err){
    console.error("License insert error: ", err)
    res.status(500).json({ 
      error: true,
      message: "Internal server error"
    })
  }
})


// Delete route
app.delete("/admin/license", verifyToken, (req, res) => {
  const deletedKey = sanitizeKey(req.body.key)

  // Validate sanitized input
  if(!deletedKey){
    return res.status(400).json({
      error: true,
      message: "Invalid or missing license key"
    })
  }

  try{
    const stmt = db.prepare("SELECT 1 FROM licenses WHERE key = ?")
    const keyDeleteExist = stmt.get([ deletedKey ])

    if(!keyDeleteExist){
      res.status(404).json({
        message: "License key not found"
      })
    }

    const deleteStmt = db.prepare("DELETE FROM licenses WHERE key = ?")
    deleteStmt.run([ deletedKey ])
    res.status(200).json({
      message: `License key ${deletedKey} deleted from database`
    })

  } catch(err){
    console.error(err)
    res.status(500).json({
      error: true,
      message: "Internal server error"
    })
  }
})


// Editing route
app.put("/admin/license", verifyToken, (req, res) => {
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

  // Prepare updated value
  const updatedKey = newKey || oldKey
  const updatedExpires = typeof daysValid === "number"
    ? new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString()
    : existing.expires

  // Finale update
  db.prepare("UPDATE licenses SET key = ?. expires = ? WHERE key =?").run(updatedKey, updatedExpires, oldKey)

  res.status(200).json({
    message: "License key updated successfully",
    key: updatedKey,
    expires: updatedExpires
  })
})