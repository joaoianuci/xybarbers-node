import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
import LocationController from './app/controllers/LocationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post(
  '/users',
  upload.single('file'),
  UserController.store,
  LocationController.store,
  FileController.store
);
routes.put(
  '/users/:user_id',
  upload.single('file'),
  UserController.update,
  LocationController.update,
  FileController.update
);

routes.get('/users/:user_id', UserController.show);
routes.delete('/users/:user_id', UserController.destroy);

export default routes;
