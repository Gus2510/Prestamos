const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const profesoresRoutes = require("./routes/profesores.routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/profesores", profesoresRoutes);


app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

app.get("/probar-base-datos", async (req, res) => {
    try {
        const [filas] = await pool.query("SELECT DATABASE() AS baseDatos");

        res.json({
            mensaje: "Conexión correcta con MySQL",
            baseDatos: filas[0].baseDatos
        });
    } catch (error) {
        console.error("Error al conectar con MySQL:", error.message);

        res.status(500).json({
            mensaje: "No fue posible conectar con MySQL",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

