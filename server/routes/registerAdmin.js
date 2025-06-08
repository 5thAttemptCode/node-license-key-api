const express = require("express")
const router = express.Router()
const db = require("../db")
const { hashPassword } = require("../utils")


router.post("/admin/register", async (req, res) => {
  const { adminName, adminPassword } = req.body

  try{
    const hashedPassword = await hashPassword(adminPassword)
    db.run("INSERT INTO admin (adminName, adminPassword) VALUES(?, ?)", [ adminName, hashedPassword ], function(err){
      if(err && err.message.includes("UNIQUE constraint failed")){
        return res.status(409).json({
          error: true,
          message: "Admin already exists"
        })
      }
      res.json({
        message: "Admin registration successful",
        adminId: this.lastID
      })
    })
  } catch(error){
    res.status(500).send({
      error: true,
      message: "Server error."
    })
  }
})

module.exports = router