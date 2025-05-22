const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadFolder = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

app.post('/api/residentes', upload.single('foto'), async (req, res) => {
  try {
    const jsonPath = path.join(__dirname, '../../data/datos.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    const nuevoResidente = {
      id: Date.now(),
      ...req.body,
      lenguajes_programacion: JSON.parse(req.body.lenguajes_programacion || '{}'),
      foto: req.file ? `http://localhost:3030/uploads/${req.file.filename}` : '',
    };

    jsonData.push(nuevoResidente);
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

    res.status(201).json(nuevoResidente);
  } catch (err) {
    console.error('Error al guardar residente:', err);
    res.status(500).json({ message: 'Error al guardar residente' });
  }
});
