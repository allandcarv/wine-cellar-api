import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';
import CommentController from './app/controllers/CommentController';
import FileController from './app/controllers/FileController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import WineController from './app/controllers/WineController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.get('/wines', WineController.index);
routes.get('/wines/:id', WineController.show);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);
routes.post('/wines', WineController.store);
routes.post('/wines/:id/comment', CommentController.store);

export default routes;
