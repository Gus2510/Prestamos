const express = require("express");

const {
    obtenerProfesores,
    obtenerProfesorPorId,
    registrarProfesor,
    actualizarProfesor,
    cambiarEstadoProfesor
} = require("../controllers/profesores.controller");

const router = express.Router();

router.get("/", obtenerProfesores);

router.get("/:id", obtenerProfesorPorId);

router.post("/", registrarProfesor);

router.put("/:id", actualizarProfesor);

router.patch("/:id/estado", cambiarEstadoProfesor);

module.exports = router;