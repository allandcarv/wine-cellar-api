import { Router } from 'express';

const routes = new Router();

routes.get('/wines', (req, res) => {
  res.json();
});

export default routes;
