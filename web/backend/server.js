const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Configuración
const PORT = process.env.PORT || 3001;
const BASE_PATH = path.join('/app/output');
const SCREENSHOTS_PATH = path.join('/app/output/screenshots');

// Middleware
app.use(cors());
app.use(morgan('dev')); // Logging
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones por ventana
});
app.use(limiter);

// Servir archivos estáticos
app.use('/screenshots', express.static(SCREENSHOTS_PATH, {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Endpoint específico para servir una imagen individual
app.get('/screenshots/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(SCREENSHOTS_PATH, filename);
    
    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Verificar que es un archivo (no un directorio)
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Not a file' });
    }
    
    // Determinar el tipo de contenido basado en la extensión
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    }
    
    // Establecer los encabezados de respuesta
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Enviar el archivo
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint específico para listar los archivos de screenshots
app.get('/screenshots/', (req, res) => {
  try {
    if (!fs.existsSync(SCREENSHOTS_PATH)) {
      return res.status(404).json({ error: 'Screenshots directory not found' });
    }

    const files = fs.readdirSync(SCREENSHOTS_PATH)
      .filter(file => file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png'))
      .map(file => `/screenshots/${file}`);

    // Devolver un HTML simple con enlaces a los archivos
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Screenshots</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            a { display: block; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Screenshots</h1>
          ${files.map(file => `<a href="${file}">${file.split('/').pop()}</a>`).join('')}
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('Error listing screenshots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verificar que la ruta de screenshots existe
if (!fs.existsSync(SCREENSHOTS_PATH)) {
  console.warn(`Advertencia: La ruta de screenshots no existe: ${SCREENSHOTS_PATH}`);
  // Crear el directorio si no existe
  fs.mkdirSync(SCREENSHOTS_PATH, { recursive: true });
  console.log(`Directorio de screenshots creado: ${SCREENSHOTS_PATH}`);
} else {
  console.log(`Directorio de screenshots encontrado: ${SCREENSHOTS_PATH}`);
}

// Middleware de validación
const validateFilePath = (req, res, next) => {
  const filePath = path.join(BASE_PATH, req.params.file);
  const normalizedPath = path.normalize(filePath);
  
  // Prevenir directory traversal
  if (!normalizedPath.startsWith(BASE_PATH)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }
  
  req.filePath = normalizedPath;
  next();
};

// Endpoints
app.get('/data/:file', validateFilePath, (req, res) => {
  try {
    if (!fs.existsSync(req.filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(req.filePath, 'utf8')
      .split('\n')
      .filter(Boolean);
    
    res.json({ data: content });
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Serving screenshots from: ${SCREENSHOTS_PATH}`);
  console.log(`Base path for data: ${BASE_PATH}`);
});
