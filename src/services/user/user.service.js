import { UserService, getOptions } from './user.class.js';

export function user(app) {
  app.use('/api/residentes', new UserService(getOptions(app)), {
    methods: ['find', 'get', 'create', 'update', 'patch', 'remove']
  });
}
