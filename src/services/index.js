import { user } from './user/user.service.js';


export function services(app) {
  app.configure(user);
}
