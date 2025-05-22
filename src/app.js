// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { sqlite } from './sqlite.js'
import { services } from './services/index.js'
import { channels } from './channels.js'

import multer from 'multer'
import path from 'path'
import fs from 'fs'
import fsPromises from 'fs/promises'
import { fileURLToPath } from 'url'

const app = express(feathers())

// Obtener __dirname compatible con ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configurar Multer para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, filename)
  }
})
const upload = multer({ storage })

app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

// Servir archivos estáticos (públicos y uploads)
app.use('/', serveStatic(app.get('public')))
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

// Ruta para subir imagen y actualizar JSON datos.json
app.post('/upload', upload.single('imagen'), async (req, res) => {
  try {
    const dbPath = path.resolve(__dirname, '../data/datos.json')
    let data = []
    try {
      const file = await fsPromises.readFile(dbPath, 'utf-8')
      data = JSON.parse(file)
    } catch (err) {
      if (err.code !== 'ENOENT') throw err
    }

    // Validar que se envió id para actualizar registro
    const id = Number(req.body.id)
    if (!id) {
      return res.status(400).json({ error: 'Falta el campo id para identificar el registro a actualizar' })
    }

    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      return res.status(404).json({ error: 'No se encontró registro con ese id' })
    }

    // Actualizar la propiedad foto con la ruta relativa de la imagen subida
    data[index].foto = `/uploads/${req.file.filename}`

    // Guardar archivo JSON actualizado
    await fsPromises.writeFile(dbPath, JSON.stringify(data, null, 2))

    res.json({
      message: 'Imagen subida y registro actualizado correctamente',
      data: data[index]
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al guardar imagen' })
  }
})

app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(sqlite)
app.configure(services)
app.configure(channels)
app.use(notFound())
app.use(errorHandler({ logger }))

app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})

app.hooks({
  setup: [],
  teardown: []
})

export { app }
