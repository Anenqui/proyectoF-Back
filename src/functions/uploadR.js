import { upload } from '../middleware/upload.js';
import express from 'express';
import path from 'path';

export const uploadRoutes = (app) => {
  const router = express.Router();

  router.post('/api/upload', upload.single('foto'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó una imagen' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
  });

  app.use('/uploads', express.static(path.resolve('uploads')));

  app.use(router);
};
