const express = require("express")
const router = express.Router()
const db = require("../db")


// Route for checking if server is up and db connected
router.get("/health", (req, res) => {
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

module.exports = router