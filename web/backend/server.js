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
app.use('/screenshots', express.static(SCREENSHOTS_PATH));

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
