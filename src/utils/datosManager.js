import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const datosPath = path.resolve(__dirname, '../../data/datos.json')

export async function leerDatos() {
  try {
    const contenido = await fs.readFile(datosPath, 'utf-8')
    return JSON.parse(contenido)
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

export async function escribirDatos(datos) {
  await fs.writeFile(datosPath, JSON.stringify(datos, null, 2), 'utf-8')
}

export async function agregarRegistro(nuevoRegistro) {
  const datosActuales = await leerDatos()
  datosActuales.push(nuevoRegistro)
  await escribirDatos(datosActuales)
}
