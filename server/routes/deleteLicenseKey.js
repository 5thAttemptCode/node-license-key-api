const express = require("express")
const router = express.Router()
const db = require("../db")
const verifyToken = require("../authMiddleware")
const sanitizeKey = require("../utils/trimmedKey")


// Route for admin to delete a license key from db
router.delete("/admin/license", verifyToken, (req, res) => {
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

module.exports = router