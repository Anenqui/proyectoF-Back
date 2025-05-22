// src/services/user/user.schema.js
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

const carrerasPermitidas = [
  'Ingeniería en Sistemas',
  'Ingeniería en Software',
  'Ingenieria en Tecnologías de la Información',
  'Ingeniería en Computación',
  'Otra carrera'
];


const lenguajesPermitidos = [
  'JavaScript', 'Python', 'C++', 'Java', 'PHP', 'HTML', 'CSS', 'Dart'
]

// Main data model schema
export const userSchema = {
  $id: 'User',
  type: 'object',
  additionalProperties: false,
  required: [
    'id',
    'nombre',
    'apellido',
    'genero',
    'fecha_nacimiento',
    'telefono',
    'correo_electronico',
    'instituto_procedencia',
    'carrera',
    'lenguajes_programacion'
  ],
  properties: {
    id: { type: 'number' },
    nombre: { type: 'string', minLength: 1 },
    apellido: { type: 'string', minLength: 1 },
    genero: { type: 'string', enum: ['masculino', 'femenino', 'otro'] },
    fecha_nacimiento: {
      type: 'string',
      format: 'date',
      maxLength: 10
    },
    telefono: {
      type: 'string',
      pattern: '^\\d{10}$'
    },
    correo_electronico: {
      type: 'string',
      format: 'email'
    },
    foto: {
      type: 'string',
      format: 'uri',
      nullable: true
    },
    instituto_procedencia: { type: 'string', minLength: 1 },
    carrera: { type: 'string', enum: carrerasPermitidas },
    lenguajes_programacion: {
      type: 'object',
      properties: Object.fromEntries(
        lenguajesPermitidos.map((lang) => [lang, { type: 'boolean' }])
      ),
      additionalProperties: false
    },
    notas: { type: 'string', nullable: true },
    self: { 
  oneOf: [
    { type: 'string' },
    { type: 'object' },
    { type: 'null' }
  ] 
}
  }
}

export const userResolver = resolve({
  properties: {
    self: async () => undefined
  }
})

export const userValidator = getValidator(userSchema, dataValidator)
export const userExternalResolver = resolve({})

// Schema para creación de datos
export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: [
    'nombre',
    'apellido',
    'genero',
    'fecha_nacimiento',
    'telefono',
    'correo_electronico',
    'instituto_procedencia',
    'carrera',
    'lenguajes_programacion'
  ],
  properties: {
    ...userSchema.properties
  }
}
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({})

// Schema para actualización parcial
export const userPatchSchema = {
  $id: 'UserPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...userSchema.properties
  }
}
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve({})

// Schema para actualización total
export const userUpdateSchema = {
  $id: 'UserUpdate',
  type: 'object',
  additionalProperties: false,
  required: [
    'id',
    'nombre',
    'apellido',
    'genero',
    'fecha_nacimiento',
    'telefono',
    'correo_electronico',
    'instituto_procedencia',
    'carrera',
    'lenguajes_programacion'
  ],
  properties: {
    ...userSchema.properties
  }
}
export const userUpdateValidator = getValidator(userUpdateSchema, dataValidator)
export const userUpdateResolver = resolve({})

// Schema para consultas
export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: true,
  properties: {
    ...querySyntax(userSchema.properties),
    nombre: { type: 'string' },
    apellido: { type: 'string' },
    self: {}  
  }
}
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({})
