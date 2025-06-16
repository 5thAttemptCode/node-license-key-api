const express = require("express")
const router = express.Router()
const db = require("../db")
const verifyToken = require("../authMiddleware")


// Route for admin to get license keys
router.get("/admin/getLicensekey", verifyToken, (req, res) => {
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

module.exports = router