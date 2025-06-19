const express = require("express")
const cors = require("cors")

// Create the app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())


const addLicenseKey = require("./routes/addLicenseKey")
const deleteLicenseKey = require("./routes/deleteLicenseKey")
const editLicenseKey = require("./routes/editLicenseKey")
const getLicenseKey = require("./routes/getLicenseKey")
const getLogs = require("./routes/getLogs")
const loginAdmin = require("./routes/loginAdmin")
const registerAdmin = require("./routes/registerAdmin")
const serverHealth = require("./routes/serverHealth")
const validateLicenseKey = require("./routes/validateLicenseKey")


// Routes
app.use('/api', addLicenseKey)
app.use('/api', deleteLicenseKey)
app.use('/api', editLicenseKey)
app.use('/api', getLicenseKey)
app.use('/api', getLogs)
app.use('/api', loginAdmin)
app.use('/api', registerAdmin)
app.use('/api', serverHealth)
app.use('/api', validateLicenseKey)

module.exports = app