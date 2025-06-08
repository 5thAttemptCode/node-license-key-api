const express = require("express")
const router = express.Router()
const db = require("../db")
const verifyToken = require("../authMiddleware")
const { addLicense, devLog, sanitizeKey } = require("../utils")


// Route for admin to add a license key to db
router.post("/admin/license", verifyToken, (req, res) => {
  const cleanedKey = sanitizeKey(req.body.key)
  const daysValid = req.body.daysValid ?? 5

  // Input validation
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
      message: `${cleanedKey} added to Database`
    })
  
  } catch(err){
    devLog("License insert error: ", err)
    res.status(500).json({ 
      error: true,
      message: "Internal server error"
    })
  }
})

module.exports = router