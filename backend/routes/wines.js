const express = require("express")
const { createWine, 
        getAllWines, 
        getSingleWine,
        deleteWine,
        updateWine
      } = require("../controllers/wineController")

//Router makes us have access to server
const router = express.Router()
//careers@kinde.com <careers@kinde.com>;


//GET all wines
router.get("/", getAllWines)

//GET single wine
router.get("/:id", getSingleWine)

//POST a new wine
router.post("/", createWine)

//DELETE a  wine
router.delete("/:id", deleteWine)

//UPDATE a wine
router.patch("/:id", updateWine)


module.exports = router