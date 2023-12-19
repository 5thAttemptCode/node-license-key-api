const mongoose = require("mongoose")

const Schema = mongoose.Schema

//A schema defines the structure of a document in the db
const wineSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    grape: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model("Wines", wineSchema)