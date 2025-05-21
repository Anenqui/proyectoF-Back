import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve('data/datos.json');

async function readUsers() {
  const raw = await fs.readFile(dataPath, 'utf-8');
  return JSON.parse(raw);
}

async function writeUsers(users) {
  await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
}

export class UserService {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const { name, lastName } = params.query || {};
    if (name && lastName) {
      return { message: `Hola ${name} ${lastName}` };
    }

    return await readUsers();
  }

    async update(id, data, params) {
    const users = await readUsers();
    const index = users.findIndex(u => String(u.id) === String(id));
    if (index === -1) throw new Error(`Usuario con ID ${id} no encontrado`);
    users[index] = { id: Number(id), ...data };

    await writeUsers(users);

    return {
      message: `Usuario con ID ${id} actualizado completamente`,
      user: users[index]
    };
  }

  async get(id, params) {
    const users = await readUsers();
    const user = users.find(u => String(u.id) === String(id));
    if (!user) throw new Error(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  async create(data, params) {
    const users = await readUsers();

    const newUser = {
      id: users.length ? users[users.length - 1].id + 1 : 1,
      ...data
    };

    users.push(newUser);
    await writeUsers(users);

    return {
      message: 'Usuario creado exitosamente',
      user: newUser
    };
  }

  async patch(id, data, params) {
    const users = await readUsers();
    const index = users.findIndex(u => String(u.id) === String(id));
    if (index === -1) throw new Error(`Usuario con ID ${id} no encontrado`);

    users[index] = { ...users[index], ...data };
    await writeUsers(users);

    return {
      message: `Usuario con ID ${id} actualizado`,
      user: users[index]
    };
  }

  async remove(id, params) {
    const users = await readUsers();
    const index = users.findIndex(u => String(u.id) === String(id));
    if (index === -1) throw new Error(`Usuario con ID ${id} no encontrado`);

    const deletedUser = users.splice(index, 1)[0];
    await writeUsers(users);

    return {
      message: `Usuario con ID ${id} eliminado`,
      user: deletedUser
    };
  }
}

export const getOptions = app => ({});
