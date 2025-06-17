const express = require("express")
const router = express.Router()
const verifyToken = require("../authMiddleware")
const db = require("../db")


router.get("/admin/logs", verifyToken, (req, res) => {
  try{
    const stmt = db.prepare("SELECT * FROM logs ORDER BY createdAt DESC")
    const logs = stmt.all()
    res.status(200).json({ logs })
  } catch(err){
    console.error(err)
    res.status(500).json({
      error: true,
      message: "Failed to fetch logs"
    })
  }
})

module.exports = router