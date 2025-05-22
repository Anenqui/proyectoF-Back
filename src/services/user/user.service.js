// src/services/user/user.service.js
import { UserService, getOptions } from './user.class.js'
import {
  userResolver,
  userExternalResolver,
  userDataResolver,
  userDataValidator,
  userPatchResolver,
  userPatchValidator,
  userQueryResolver,
  userQueryValidator,
  userUpdateValidator,
  userUpdateResolver
} from './user.schema.js'

import {
  resolveResult,
  resolveExternal,
  validateData,
  validateQuery,
  resolveData
} from '@feathersjs/schema'

// Hook para eliminar `self`
const removeSelfProperty = async context => {
  if (context.data && context.data.self) {
    delete context.data.self
  }
  return context
}

// Hook para validar la fecha de nacimiento
const validarFechaNacimiento = async context => {
  const { fecha_nacimiento } = context.data;

  if (fecha_nacimiento) {
    const fecha = new Date(fecha_nacimiento);
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);
    fecha.setHours(0, 0, 0, 0);

    if (fecha > hoy) {
      throw new Error('La fecha de nacimiento no puede ser una fecha posterior.');
    }
  }

  return context;
};

// ✅ Hook para convertir strings JSON a objetos
const parseJsonFields = (fields) => {
  return async (context) => {
    if (context.data) {
      for (const field of fields) {
        if (typeof context.data[field] === 'string') {
          try {
            context.data[field] = JSON.parse(context.data[field])
          } catch (e) {
            throw new Error(`El campo '${field}' no contiene JSON válido`)
          }
        }
      }
    }
    return context
  }
}

export function user(app) {
  app.use('/api/residentes', new UserService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  })

  app.service('/api/residentes').hooks({
    around: {
      all: [
        resolveExternal(userExternalResolver),
        resolveResult(userResolver)
      ]
    },
    before: {
      all: [
        validateQuery(userQueryValidator),
        resolveData(userQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        removeSelfProperty,
        parseJsonFields(['lenguajes_programacion']), 
        validateData(userDataValidator),
        validarFechaNacimiento,
        resolveData(userDataResolver)
      ],
      update: [
        removeSelfProperty,
        parseJsonFields(['lenguajes_programacion']), 
        validarFechaNacimiento,
        validateData(userUpdateValidator),
        resolveData(userUpdateResolver)
      ],
      patch: [
        removeSelfProperty,
        parseJsonFields(['lenguajes_programacion']), 
        validarFechaNacimiento,
        validateData(userPatchValidator),
        resolveData(userPatchResolver)
      ],
      remove: []
    },
    after: {},
    error: {}
  })
}
