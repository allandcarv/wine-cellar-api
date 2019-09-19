import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/wines', (req, res) => {
  res.json();
});

routes.post('/users', UserController.store);

export default routes;
