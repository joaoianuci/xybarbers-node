import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import multerConfig from './config/multer';
import FileController from './app/controllers/FileController';
import LocationController from './app/controllers/LocationController';
import ForgotPasswordController from './app/controllers/ForgotPasswordController';
import ResetPasswordController from './app/controllers/ResetPasswordController';
import AuthenticateController from './app/controllers/AuthenticateController';
import SearchController from './app/controllers/SearchController';

import authMiddleware from './middlewares/auth';

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
  authMiddleware,
  upload.single('file'),
  UserController.update,
  LocationController.update,
  FileController.update
);

routes.get('/users/:user_id', UserController.show);
routes.delete('/users/:user_id', authMiddleware, UserController.destroy);

routes.get('/debug-sentry', function mainHandler() {
  throw new Error('My first Sentry error!');
});

routes.post('/forgot', ForgotPasswordController.store);
routes.post('/reset', ResetPasswordController.store);

routes.post('/users/authenticate', AuthenticateController.store);

routes.get('/providers', SearchController.index);

export default routes;
