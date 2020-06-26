import { Router } from 'express';
import ExpressBrute from 'express-brute';

import multer from 'multer';
import UserController from './app/controllers/UserController';
import multerConfig from './config/multer';

import FileController from './app/controllers/FileController';
import LocationController from './app/controllers/LocationController';
import ForgotPasswordController from './app/controllers/ForgotPasswordController';
import ResetPasswordController from './app/controllers/ResetPasswordController';
import AuthenticateController from './app/controllers/AuthenticateController';
import SearchController from './app/controllers/SearchController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';

import authMiddleware from './middlewares/auth';
import ProviderValidateController from './app/controllers/ProviderValidateController';
import ScheduleController from './app/controllers/ScheduleController';
import AvailableController from './app/controllers/AvailableController';

const routes = new Router();
const upload = multer(multerConfig);
const store = new ExpressBrute.MemoryStore();
const bruteForce = new ExpressBrute(store);

routes.post(
  '/users',
  upload.single('file'),
  UserController.store,
  LocationController.store,
  FileController.store
);

routes.post(
  '/users/authenticate',
  bruteForce.prevent,
  AuthenticateController.store
);

routes.post('/forgot', ForgotPasswordController.store);
routes.post('/reset', ResetPasswordController.store);

routes.use(authMiddleware);

routes.put(
  '/users/:user_id',
  upload.single('file'),
  UserController.update,
  LocationController.update,
  FileController.update
);

routes.get('/users/:user_id', UserController.show);
routes.delete('/users/:user_id', UserController.destroy);

routes.get('/debug-sentry', function mainHandler() {
  throw new Error('My first Sentry error!');
});

routes.get('/providers', SearchController.index);

routes.post('/appointments/:user_id', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:provider_id', AppointmentController.destroy);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:notification_id', NotificationController.read);

routes.post('/providers/validate', ProviderValidateController.store);

routes.get('/schedule', ScheduleController.index);

routes.get('/providers/:provider_id/available', AvailableController.index);

export default routes;
