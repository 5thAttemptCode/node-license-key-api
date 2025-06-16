const express = require("express")
const router = express.Router()
const db = require("../db")
const { hashPassword } = require("../utils")


router.post("/admin/register", async (req, res) => {
  const { adminName, adminPassword } = req.body

  try{
    const hashedPassword = await hashPassword(adminPassword)
    const stmt = db.prepare("INSERT INTO admin (adminName, adminPassword) VALUES (?, ?)")
    const info = stmt.run(adminName, hashedPassword)

    res.json({
      message: "Admin registration successful",
      adminId: info.lastInsertRowid,
    })
  } catch(error){
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        error: true,
        message: "Admin already exists",
      })
    }

    console.error("Registration error:", err.message)
    res.status(500).json({
      error: true,
      message: "Server error.",
    })
  }
})

module.exports = router