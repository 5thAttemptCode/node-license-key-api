const db = require ("./db")
import { addLicense } from "./utils/addLicense"

// Add test licenses
addLicense(db, "ABC123")
addLicense(db, "DEF456")
addLicense(db, "GHI789", -5) // expired