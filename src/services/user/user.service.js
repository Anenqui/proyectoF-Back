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
      all: [validateQuery(userQueryValidator), resolveData(userQueryResolver)],
      find: [],
      get: [],
      create: [
        removeSelfProperty,
        validateData(userDataValidator),
        validarFechaNacimiento,
        resolveData(userDataResolver)
      ],
      update: [
        removeSelfProperty,
        validarFechaNacimiento,
        validateData(userUpdateValidator),
        resolveData(userUpdateResolver)
      ],
      patch: [
        removeSelfProperty,
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
