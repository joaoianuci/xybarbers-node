import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post(
  '/users',
  upload.single('file'),
  UserController.store,
  FileController.store
);

export default routes;
