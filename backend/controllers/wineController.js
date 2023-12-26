const Wine = require("../models/wineModel")
const mongoose = require("mongoose")

//GET all wines
const getAllWines = async (req, res) => {
    const user_id = req.user._id
    const wines = await Wine.find({ user_id }).sort({createdAt: -1})
    res.status(200).json(wines)
}

//GET a single wine
const getSingleWine = async (req, res) => {
    const { id } = req.params

    //This sees if the id we pass is valid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({errors: "No such wine. Maybe you drank it already?"})
    }

    const wine = await Wine.findById(id)

    if(!wine){
        return res.status(400).json({error: "No wine found. Maybe you drank it already?"})
    }
    res.status(200).json(wine)
}

//POST new wine
const createWine = async(req, res) => {
    const {title, grape, color} = req.body

    let emptyFields = []

    if(!title){
        emptyFields.push("title")
    }
    if(!grape){
        emptyFields.push("grape")
    }
    if(!color){
        emptyFields.push("color")
    }
    if(emptyFields.length > 0){
        return res.status(400).json({errors: "Missing fields: ", emptyFields})
    }

    //add doc to db
    try{
        const user_id = req.user._id
        const wine = await Wine.create({title, grape, color, user_id})
        res.status(200).json(wine)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

//DELETE a wine
const deleteWine = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({errors: "No such wine. Maybe you drank it already?"})
    }

    const wine = await Wine.findOneAndDelete({_id: id})

    if(!wine){
        return res.status(400).json({error: "No wine found. Maybe you drank it already?"})
    }

    res.status(200).json(wine)
}

//PATCH a wine
const updateWine = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({errors: "No such wine. Maybe you drank it already?"})
    }

    const wine = await Wine.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!wine){
        return res.status(400).json({error: "No wine found. Maybe you drank it already?"})
    }

    res.status(200).json(wine)
}


module.exports = {
    createWine,
    getAllWines,
    getSingleWine,
    deleteWine,
    updateWine
}