require("dotenv").config()
const express = require("express")
const wineRoutes = require("./routes/wines")
const userRoutes = require("./routes/user")
const mongoose = require("mongoose")


const app = express()

//Middleware
app.use(express.json())//checks if any req has a body to it
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//Routes
app.use("/api/wines", wineRoutes)
app.use("/api/user", userRoutes)

//Connect to DB
mongoose.connect(process.env.VITE_MONGO_URI)
    .then(() => {
        //Port
        app.listen(process.env.VITE_PORT, () => {
            console.log("SERVER RUNS SMOOTHLY")
        })
    })
    .catch((error) => {
        console.log(error)
    })

