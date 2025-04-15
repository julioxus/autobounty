const fs = require('fs');
const path = require('path');

// Rutas a verificar
const paths = [
  '/app',
  '/app/output',
  '/app/output/screenshots'
];

console.log('Verificando rutas y permisos:');

paths.forEach(dirPath => {
  try {
    const exists = fs.existsSync(dirPath);
    console.log(`\nRuta: ${dirPath}`);
    console.log(`Existe: ${exists}`);
    
    if (exists) {
      const stats = fs.statSync(dirPath);
      console.log(`Es directorio: ${stats.isDirectory()}`);
      console.log(`Permisos: ${stats.mode.toString(8)}`);
      
      if (stats.isDirectory()) {
        try {
          const files = fs.readdirSync(dirPath);
          console.log(`Contenido (${files.length} elementos):`);
          files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const fileStats = fs.statSync(filePath);
            console.log(`  - ${file} (${fileStats.isDirectory() ? 'directorio' : 'archivo'})`);
          });
        } catch (err) {
          console.error(`Error al leer el directorio: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error al verificar ${dirPath}: ${err.message}`);
  }
}); 