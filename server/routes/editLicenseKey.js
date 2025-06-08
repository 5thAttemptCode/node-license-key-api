const express = require("express")
const router = express.Router()
const db = require("../db")
const verifyToken = require("../authMiddleware")
const { editLicense, sanitizeKey } = require("../utils")


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

  try{
    const result = editLicense(db, oldKey, newKey, daysValid)

    if(!result.success){
      return res.status(result.status).join({
        error: true,
        message: result.message
      })
    }

    res.status(200).json({
      message: "License key updated successfully",
      ...result
    })
  } catch(err){
    console.error(err)
    res.status(500).json({
      error: true,
      message: "Internal server error"
    })
  }
})

module.exports = router