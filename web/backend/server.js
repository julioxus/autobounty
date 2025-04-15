const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use('/screenshots', express.static(path.join(__dirname, '../../recon/output/screenshots')));

const basePath = path.join(__dirname, '../../recon/output');

app.get('/data/:file', (req, res) => {
  const filePath = path.join(basePath, req.params.file);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  const content = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
  res.json(content);
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
