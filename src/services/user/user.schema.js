// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const userSchema = {
  $id: 'User',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'password', 'first_name', 'last_name', 'username', 'email', 'gender'],
  properties: {
    id: { type: 'number' },
    password: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    username: { type: 'string' },
    email: { type: 'string' },
    gender: { type: 'string' }
  }
};
    export const userUpdateSchema = {
      $id: 'UserUpdate',
      type: 'object',
      additionalProperties: false,
      required: ['id', 'password', 'first_name', 'last_name', 'username', 'email', 'gender'], 
      properties: {
        ...userSchema.properties
      }
    };

export const userUpdateValidator = getValidator(userUpdateSchema, dataValidator);
export const userUpdateResolver = resolve({});

export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve({})

export const userExternalResolver = resolve({})

// Schema for creating new data
export const userDataSchema = {
  $id: 'UserData',
  type: 'object',
  additionalProperties: false,
  required: ['password', 'first_name', 'last_name', 'username', 'email', 'gender'],
  properties: {
    ...userSchema.properties
  }
}

export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve({})

// Schema for updating existing data
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

// Schema for allowed query properties
export const userQuerySchema = {
  $id: 'UserQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(userSchema.properties),
    name: { type: 'string' },
    lastName: { type: 'string' }
  }
}

export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve({})
