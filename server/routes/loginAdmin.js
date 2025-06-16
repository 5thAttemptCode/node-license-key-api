const express = require("express")
const router = express.Router()
const db = require("../db")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

// Load secret from .env
const JWT_SECRET = process.env.JWT_SECRET


router.post("/admin/login", async (req, res) => {
  const { adminName, adminPassword } = req.body

  // Query db for admin
  try {
    const stmt = db.prepare("SELECT * FROM admin WHERE adminName = ?")
    const row = stmt.get(adminName);

    if (!row) {
      return res.status(400).json({
        error: true,
        message: "Admin name not found"
      })
    }

    const passwordMatch = await bcrypt.compare(adminPassword, row.adminPassword)

    if (!passwordMatch) {
      return res.status(400).json({
        error: true,
        message: "Incorrect password"
      })
    }

    const token = jwt.sign(
      { adminId: row.id, adminname: row.adminName },
      JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.json({
      message: "Login successful",
      token
    })

  } catch (err) {
    res.status(500).json({
      error: true,
      message: err.message
    })
  }
})

module.exports = router 