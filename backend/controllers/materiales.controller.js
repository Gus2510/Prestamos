const pool = require("../config/db");

const obtenerMateriales = async (req, res) => {

    try {

        const [materiales] = await pool.query(`

            SELECT
                idequipo AS id,
                nombre,
                codigoInventario AS codigo,
                'Inventario' AS categoria,
                NULL AS descripcion,
                NULL AS cantidad

            FROM equipo

            UNION ALL

            SELECT
                idconsumible AS id,
                nombre,
                NULL AS codigo,
                'Consumo' AS categoria,
                descripcion,
                cantidad

            FROM consumible

            ORDER BY nombre;

        `);

        res.json(materiales);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener materiales"
        });

    }

};

module.exports = {
    obtenerMateriales
};