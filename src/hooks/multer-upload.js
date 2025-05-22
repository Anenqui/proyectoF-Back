import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Configura multer como antes
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads') // carpeta uploads en raíz
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, filename)
  }
})

// Middleware multer
const upload = multer({ storage })

export function multerUploadHook(fieldName = 'foto') {
  return async (context) => {
    const { params, data } = context

    // multer necesita acceso al req y res de Express
    // Estos están en context.params.rest y context.params.headers (pero no siempre)
    if (!params?.headers) {
      // Si no es REST o no hay headers, no hacemos nada
      return context
    }

    // Usamos la API de multer para procesar un único archivo
    // Pero multer es middleware, y Feathers no está pensado para middleware asíncronos
    // Solución: creamos una promesa que se resuelve cuando multer procesa el archivo

    await new Promise((resolve, reject) => {
      upload.single(fieldName)(context.params._req, context.params._res, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })

    // Ahora el archivo está en context.params._req.file
    if (context.params._req.file) {
      // Guardamos la ruta accesible en data para que el servicio la guarde
      data.foto = `/uploads/${context.params._req.file.filename}`
    }

    return context
  }
}
