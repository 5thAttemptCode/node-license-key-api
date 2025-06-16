const express = require("express")
const cors = require("cors")

const app = express()
// Allows the frontend to make requests
app.use(cors())
// Tells Express to automatically parse JSON in incoming requests. 
// Without this, req.body would be undefined.
app.use(express.json())

const PORT = 3000


const addLicenseKey = require("./routes/addLicenseKey")
const deleteLicenseKey = require("./routes/deleteLicenseKey")
const editLicenseKey = require("./routes/editLicenseKey")
const getLicenseKey = require("./routes/getLicenseKey")
const loginAdmin = require("./routes/loginAdmin")
const registerAdmin = require("./routes/registerAdmin")
const serverHealth = require("./routes/serverHealth")
const validateLicenseKey = require("./routes/validateLicenseKey")


// Routes
app.use('/api', addLicenseKey)
app.use('/api', deleteLicenseKey)
app.use('/api', editLicenseKey)
app.use('/api', getLicenseKey)
app.use('/api', loginAdmin)
app.use('/api', registerAdmin)
app.use('/api', serverHealth)
app.use('/api', validateLicenseKey)

app.listen(PORT, () => {
  console.log(`✅ License server is running at http://localhost:${PORT}`)
})