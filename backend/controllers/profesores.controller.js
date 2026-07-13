const pool = require("../config/db");

/* Consultar todos los profesores */
const obtenerProfesores = async (req, res) => {
    try {
        const sql = `
            SELECT
                idpersonal,
                nombre,
                apellidoP,
                apellidoM,
                numeroEconomico,
                correo,
                telefono,
                extension,
                estado,
                CONCAT_WS(
                    ' ',
                    nombre,
                    apellidoP,
                    apellidoM
                ) AS nombreCompleto
            FROM personal
            ORDER BY nombre ASC, apellidoP ASC, apellidoM ASC
        `;

        const [profesores] = await pool.query(sql);

        res.status(200).json(profesores);

    } catch (error) {
        console.error("Error al consultar profesores:", error);

        res.status(500).json({
            mensaje: "No fue posible consultar los profesores.",
            error: error.message
        });
    }
};

/* Consultar un profesor por ID */
const obtenerProfesorPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT
                idpersonal,
                nombre,
                apellidoP,
                apellidoM,
                numeroEconomico,
                correo,
                telefono,
                extension,
                estado
            FROM personal
            WHERE idpersonal = ?
        `;

        const [resultados] = await pool.query(sql, [id]);

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Profesor no encontrado."
            });
        }

        res.status(200).json(resultados[0]);

    } catch (error) {
        console.error("Error al consultar profesor:", error);

        res.status(500).json({
            mensaje: "No fue posible consultar al profesor.",
            error: error.message
        });
    }
};

/* Registrar profesor */
const registrarProfesor = async (req, res) => {
    try {
        const {
            nombre,
            apellidoP,
            apellidoM,
            numeroEconomico,
            correo,
            telefono,
            extension
        } = req.body;

        if (!nombre || !apellidoP || !numeroEconomico || !correo) {
            return res.status(400).json({
                mensaje:
                    "Nombre, apellido paterno, número económico y correo son obligatorios."
            });
        }

        const sql = `
            INSERT INTO personal
            (
                nombre,
                apellidoP,
                apellidoM,
                numeroEconomico,
                correo,
                telefono,
                estado,
                extension
            )
            VALUES (?, ?, ?, ?, ?, ?, 'ACTIVO', ?)
        `;

        const [resultado] = await pool.query(sql, [
            nombre,
            apellidoP,
            apellidoM || null,
            numeroEconomico,
            correo,
            telefono || null,
            extension || null
        ]);

        res.status(201).json({
            mensaje: "Profesor registrado correctamente.",
            idProfesor: resultado.insertId
        });

    } catch (error) {
        console.error("Error al registrar profesor:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje:
                    "El número económico, correo o teléfono ya está registrado."
            });
        }

        res.status(500).json({
            mensaje: "No fue posible registrar al profesor.",
            error: error.message
        });
    }
};

/* Editar profesor */
const actualizarProfesor = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            apellidoP,
            apellidoM,
            numeroEconomico,
            correo,
            telefono,
            extension
        } = req.body;

        if (!nombre || !apellidoP || !numeroEconomico || !correo) {
            return res.status(400).json({
                mensaje:
                    "Nombre, apellido paterno, número económico y correo son obligatorios."
            });
        }

        const sql = `
            UPDATE personal
            SET
                nombre = ?,
                apellidoP = ?,
                apellidoM = ?,
                numeroEconomico = ?,
                correo = ?,
                telefono = ?,
                extension = ?
            WHERE idpersonal = ?
        `;

        const [resultado] = await pool.query(sql, [
            nombre,
            apellidoP,
            apellidoM || null,
            numeroEconomico,
            correo,
            telefono || null,
            extension || null,
            id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Profesor no encontrado."
            });
        }

        res.status(200).json({
            mensaje: "Profesor actualizado correctamente."
        });

    } catch (error) {
        console.error("Error al actualizar profesor:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensaje:
                    "El número económico, correo o teléfono ya pertenece a otro profesor."
            });
        }

        res.status(500).json({
            mensaje: "No fue posible actualizar al profesor.",
            error: error.message
        });
    }
};

/* Cambiar estado ACTIVO / INACTIVO */
const cambiarEstadoProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!["ACTIVO", "INACTIVO"].includes(estado)) {
            return res.status(400).json({
                mensaje: "El estado debe ser ACTIVO o INACTIVO."
            });
        }

        const sql = `
            UPDATE personal
            SET estado = ?
            WHERE idpersonal = ?
        `;

        const [resultado] = await pool.query(sql, [estado, id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Profesor no encontrado."
            });
        }

        res.status(200).json({
            mensaje: `Profesor marcado como ${estado}.`
        });

    } catch (error) {
        console.error("Error al cambiar estado:", error);

        res.status(500).json({
            mensaje: "No fue posible cambiar el estado.",
            error: error.message
        });
    }
};

module.exports = {
    obtenerProfesores,
    obtenerProfesorPorId,
    registrarProfesor,
    actualizarProfesor,
    cambiarEstadoProfesor
};