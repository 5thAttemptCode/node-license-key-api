const express = require("express")
const cors = require("cors")

const addLicenseKey = require("./routes/addLicenseKey")
const deleteLicenseKey = require("./routes/deleteLicenseKey")
const editLicenseKey = require("./routes/editLicenseKey")
const getLicenseKey = require("./routes/getLicenseKey")
const serverHealth = require("./routes/serverHealth")
const validateLicenseKey = require("./routes/validateLicenseKey")

const app = express()
const PORT = 3000

// Allows the frontend to make requests
app.use(cors())

// Tells Express to automatically parse JSON in incoming requests. 
// Without this, req.body would be undefined.
app.use(express.json())

// Routes
app.use(addLicenseKey)
app.use(deleteLicenseKey)
app.use(editLicenseKey)
app.use(getLicenseKey)
app.use(serverHealth)
app.use(validateLicenseKey)

app.listen(PORT, () => {
  console.log(`✅ License server is running at http://localhost:${PORT}`)
})