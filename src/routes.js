import { Router } from 'express';
import ExpressBrute from 'express-brute';

import multer from 'multer';
import UserController from './app/controllers/UserController';
import multerConfig from './config/multer';

import AddressController from './app/controllers/AddressController';
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
import RatingController from './app/controllers/RatingController';
import ServiceController from './app/controllers/ServiceController';

const routes = new Router();
const upload = multer(multerConfig);
const store = new ExpressBrute.MemoryStore();
const bruteForce = new ExpressBrute(store);

routes.post(
  '/users',
  upload.single('file'),
  UserController.store,
  LocationController.store,
  AddressController.store,
  FileController.store
);

routes.post(
  '/users/authenticate',
  bruteForce.prevent,
  AuthenticateController.store
);

routes.post('/forgot', ForgotPasswordController.store);
routes.post('/reset', ResetPasswordController.store);

routes.put('/notifications/:notification_id', NotificationController.read);

routes.use(authMiddleware);

routes.put(
  '/users',
  upload.single('file'),
  UserController.update,
  AddressController.update,
  LocationController.update,
  FileController.update
);

routes.get('/users', UserController.show);
routes.delete('/users', UserController.destroy);

routes.post('/users/:provider_id/rating', RatingController.store);
routes.get('/users/:provider_id/rating', RatingController.index);

routes.post('/users/services', ServiceController.store);
routes.get('/users/services/:service_id', ServiceController.show);
routes.put('/users/services/:service_id', ServiceController.update);
routes.get('/users/services', ServiceController.index);
routes.delete('/users/services/:service_id', ServiceController.destroy);

routes.get('/debug-sentry', function mainHandler() {
  throw new Error('My first Sentry error!');
});

routes.get('/providers', SearchController.index);
routes.post('/providers/validate', ProviderValidateController.store);
routes.get('/providers/:provider_id/available', AvailableController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete(
  '/appointments/:provider_id/:service_id',
  AppointmentController.destroy
);

routes.get('/notifications', NotificationController.index);

routes.get('/schedule', ScheduleController.index);

export default routes;
