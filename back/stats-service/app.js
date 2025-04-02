import express from "express";
import { spawn } from "child_process"; // Usar spawn en lugar de exec
import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // Asegúrate de instalar node-fetch si usas Node < 18
import { fileURLToPath } from "url";
import 'dotenv/config'; // Para variables de entorno

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const IMAGE_DIR = path.join(__dirname, "images");
const STATS_SERVER_URL = process.env.STATS_SERVER_URL; // URL desde .env

// Configuración inicial: asegurar que la carpeta de imágenes existe
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

app.use(express.json());

// Función para hacer fetch a la API de estadísticas
const fetchStats = async (email, fecha) => {
    try {
        let endpoint;

        if (email && fecha) {
            endpoint = `${STATS_SERVER_URL}/stats/filter?email=${encodeURIComponent(email)}&date=${encodeURIComponent(fecha)}`;
        } else if (email) {
            endpoint = `${STATS_SERVER_URL}/stats/email/${encodeURIComponent(email)}`;
        } else if (fecha) {
            endpoint = `${STATS_SERVER_URL}/stats/date/${encodeURIComponent(fecha)}`;
        } else {
            throw new Error("Se requiere al menos un parámetro: email o fecha.");
        }

        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching stats: ${error.message}`);
    }
};

const postStats = async (data) => {
    try {
        const endpoint = `${STATS_SERVER_URL}/stats`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Error posting stats: ${error.message}`);
    }
};

// Ruta para subir datos a MongoDB
app.post("/upload-stats", async (req, res) => {
    const { email, estadisticas } = req.body;

    // Validar que se proporcionen los datos necesarios
    if (
        !email || !estadisticas ||
        typeof estadisticas.ghost_killed !== "number" ||
        typeof estadisticas.grunt_killed !== "number" ||
        typeof estadisticas.horse_killed !== "number" ||
        typeof estadisticas.ogre_killed !== "number" ||
        typeof estadisticas.wolf_killed !== "number" ||
        typeof estadisticas.boss_killed !== "number"
    ) {
        return res.status(400).json({
            error: "Modelo incorrecto",
            ejemplo: {
                email: "usuario@dominio.com",
                estadisticas: {
                    ghost_killed: 0,
                    grunt_killed: 0,
                    horse_killed: 0,
                    ogre_killed: 0,
                    wolf_killed: 0,
                    boss_killed: 0
                }
            }
        });
    }

    // Generar la fecha automáticamente si no se proporciona
    const fecha = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

    try {
        // Llamar a la ruta /stats para insertar los datos en MongoDB
        const endpoint = `${STATS_SERVER_URL}/stats`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, fecha, estadisticas }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        res.status(201).json({
            message: "Datos subidos exitosamente a MongoDB",
            datos_enviados: { email, fecha, estadisticas },
            respuesta_api: result,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al subir los datos a MongoDB",
            detalle: error.message,
        });
    }
});

// Ruta para generar una imagen basada en los parámetros proporcionados
app.post("/generate", async (req, res) => {
    const { email, fecha } = req.body;

    if (!email && !fecha) {
        return res.status(400).json({ error: "Se requiere al menos email o fecha" });
    }

    const filename = `stats_${Date.now()}.png`;
    const filepath = path.join(IMAGE_DIR, filename);

    try {
        // Obtener datos desde la API remota según los parámetros proporcionados
        const response = await fetchStats(email, fecha);
        const data = response.data;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron registros" });
        }

        console.log(`Datos obtenidos:, ${JSON.stringify(data)}`);

        // Crear archivo temporal con los datos obtenidos
        const tempDataFile = path.join(IMAGE_DIR, `temp_${filename}.json`);
        fs.writeFileSync(tempDataFile, JSON.stringify(data));

        console.log(`Datos guardados en ${tempDataFile}`);
        
        // Usar spawn para ejecutar el script de Python
        const pythonProcess = spawn("python3", ["generate_image.py", tempDataFile, filepath]);

        pythonProcess.stdout.on("data", (data) => {
            console.log(`stdout: ${data.toString()}`);
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`stderr: ${data.toString()}`);
        });

        pythonProcess.on("close", (code) => {
            fs.unlinkSync(tempDataFile); // Eliminar archivo temporal

            if (code !== 0) {
                return res.status(500).json({
                    error: "Error al generar la imagen",
                    detalle: `El proceso Python terminó con código ${code}`,
                });
            }

            res.json({
                message: "Imagen generada",
                url: `${process.env.BASE_URL}/images/${filename}`,
                metadata: {
                    parametros: { email, fecha },
                    registros: data.length,
                    fecha_generacion: new Date().toISOString(),
                },
            });

            // Eliminar imagen después de 3 horas
            setTimeout(() => {
                fs.unlink(filepath, (err) => {
                    if (!err) console.log(`Imagen eliminada: ${filename}`);
                });
            }, 3 * 60 * 60 * 1000);
        });
    } catch (error) {
        res.status(500).json({
            error: "Error en el proceso",
            detalle: error.message,
            sistema: "Generador de imágenes",
        });
    }
});

// Ruta para generar datos de prueba automáticamente
app.post("/test-data", async (req, res) => {
    const email = req.body.email || `test_user_${Date.now()}@example.com`;
    const fecha = req.body.fecha || new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

    const estadisticas = {
        ghost_killed: Math.floor(Math.random() * 10),
        grunt_killed: Math.floor(Math.random() * 10),
        horse_killed: Math.floor(Math.random() * 10),
        ogre_killed: Math.floor(Math.random() * 10),
        wolf_killed: Math.floor(Math.random() * 10),
        boss_killed: Math.floor(Math.random() * 5),
    };

    try {
        const postResponse = await postStats({ email, fecha, estadisticas });

        res.status(201).json({
            message: "Datos de prueba generados y subidos exitosamente",
            test_data: { email, fecha, estadisticas },
            api_response: postResponse,
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al generar los datos de prueba",
            detalle: error.message,
        });
    }
});

// Servir imágenes generadas
app.use("/images", express.static(IMAGE_DIR));

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
    console.log(`Conectado a API de estadísticas en ${STATS_SERVER_URL}`);
});
