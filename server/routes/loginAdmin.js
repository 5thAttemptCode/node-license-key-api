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
  db.get("SELECT * FROM admins WHERE adminName = ?", [ adminName ], async (err, row) => {
    if(err){
      return res.status(500).json({
        error: true,
        message: err.message
      })
    }
    if(!row){
      return res.status(400).json({
        error: true,
        message: "Admin name not found"
      })
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(adminPassword, row.adminPassword)
    
    if(!passwordMatch){
      return res.status(400).json({
        error: true,
        message: "Incorrect password"
      })
    }

    // Generate jwt token
    const token = jwt.sign(
      { adminId: row.id, adminname: row.adminName }, // Payload
      JWT_SECRET,                                    // Signature secret
      { expiresIn: "1h"}                           
    )

    res.json({
      message: "Login successfull"
    })
  })
})

module.exports = router 