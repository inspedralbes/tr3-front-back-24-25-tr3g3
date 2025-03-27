import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';

// Configuración para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const currentDir = __dirname;

// Leer los directorios en el nivel actual
fs.readdirSync(currentDir).forEach(item => {
  const itemPath = path.join(currentDir, item);
  const stat = fs.statSync(itemPath);

  if (stat.isDirectory()) {
    const appPath = path.join(itemPath, 'app.js');
    
    if (fs.existsSync(appPath)) {
      // Iniciar cada servicio como un proceso hijo
      const child = fork(appPath);
      
      console.log(`Servicio en ${item} iniciado`);
      
      child.on('error', (error) => {
        console.error(`Error en el servicio ${item}:`, error);
      });
    }
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor principal escuchando en el puerto ${PORT}`);
});
