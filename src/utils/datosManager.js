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

export async function actualizarFoto(id, fotoPath) {
  const datos = await leerDatos()
  const index = datos.findIndex(item => item.id === id)
  if (index === -1) {
    throw new Error('Registro no encontrado')
  }
  datos[index].foto = fotoPath
  await escribirDatos(datos)
  return datos[index]
}
