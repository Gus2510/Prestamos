const express = require("express");

const {

    obtenerMateriales

} = require("../controllers/materiales.controller");

const router = express.Router();

router.get("/", obtenerMateriales);

module.exports = router;